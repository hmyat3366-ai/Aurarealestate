import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { vi } from 'vitest';

export interface MockRouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (url: string) => void;
  history: string[];
}

export const MockRouterContext = createContext<MockRouterContextType>({
  pathname: '/',
  searchParams: new URLSearchParams(),
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
  history: ['/'],
});

export const useMockRouter = () => useContext(MockRouterContext);

export interface MockRouterProviderProps {
  children: ReactNode;
  initialPathname?: string;
  initialSearchParams?: Record<string, string> | string | URLSearchParams;
  onNavigate?: (url: string) => void;
}

export const MockRouterProvider: React.FC<MockRouterProviderProps> = ({
  children,
  initialPathname = '/',
  initialSearchParams = {},
  onNavigate,
}) => {
  const [pathname, setPathname] = useState(initialPathname);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (initialSearchParams instanceof URLSearchParams) return initialSearchParams;
    if (typeof initialSearchParams === 'string') return new URLSearchParams(initialSearchParams);
    return new URLSearchParams(initialSearchParams);
  });
  const [history, setHistory] = useState<string[]>([initialPathname]);

  const pushSpy = vi.fn((url: string) => {
    const [newPath, newQuery] = url.split('?');
    setPathname(newPath || '/');
    setSearchParams(new URLSearchParams(newQuery || ''));
    setHistory((prev) => [...prev, url]);
    onNavigate?.(url);
  });

  const replaceSpy = vi.fn((url: string) => {
    const [newPath, newQuery] = url.split('?');
    setPathname(newPath || '/');
    setSearchParams(new URLSearchParams(newQuery || ''));
    setHistory((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = url;
      return copy;
    });
    onNavigate?.(url);
  });

  const backSpy = vi.fn(() => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const copy = [...prev];
      copy.pop();
      const lastUrl = copy[copy.length - 1];
      const [newPath, newQuery] = lastUrl.split('?');
      setPathname(newPath || '/');
      setSearchParams(new URLSearchParams(newQuery || ''));
      return copy;
    });
  });

  const forwardSpy = vi.fn();
  const refreshSpy = vi.fn();
  const prefetchSpy = vi.fn();

  const contextValue = useMemo<MockRouterContextType>(
    () => ({
      pathname,
      searchParams,
      push: pushSpy,
      replace: replaceSpy,
      back: backSpy,
      forward: forwardSpy,
      refresh: refreshSpy,
      prefetch: prefetchSpy,
      history,
    }),
    [pathname, searchParams, history]
  );

  return (
    <MockRouterContext.Provider value={contextValue}>
      {children}
    </MockRouterContext.Provider>
  );
};

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialPathname?: string;
  initialSearchParams?: Record<string, string> | string | URLSearchParams;
}

export function renderWithRouter(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { routerContext: MockRouterContextType } {
  const { initialPathname = '/', initialSearchParams = {}, ...renderOptions } = options;

  let capturedContext!: MockRouterContextType;

  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <MockRouterProvider
        initialPathname={initialPathname}
        initialSearchParams={initialSearchParams}
      >
        <ContextCapture onCapture={(ctx) => (capturedContext = ctx)}>
          {children}
        </ContextCapture>
      </MockRouterProvider>
    );
  };

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...renderResult,
    routerContext: capturedContext,
  };
}

const ContextCapture: React.FC<{
  onCapture: (ctx: MockRouterContextType) => void;
  children: ReactNode;
}> = ({ onCapture, children }) => {
  const ctx = useMockRouter();
  onCapture(ctx);
  return <>{children}</>;
};
