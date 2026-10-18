import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { AuthDatabase } from "@/lib/server/db";
import { POST as sendOtpHandler } from "@/app/api/auth/otp/send/route";
import { POST as verifyOtpHandler } from "@/app/api/auth/otp/verify/route";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { GET as meHandler } from "@/app/api/auth/me/route";
import { POST as logoutHandler } from "@/app/api/auth/logout/route";
import {
  GET as getSavedHandler,
  POST as postSavedHandler,
  DELETE as deleteSavedHandler,
} from "@/app/api/account/saved/route";
import { POST as syncSavedHandler } from "@/app/api/account/saved/sync/route";
import {
  GET as getViewingsHandler,
  POST as postViewingHandler,
} from "@/app/api/account/viewings/route";
import { POST as cancelViewingHandler } from "@/app/api/account/viewings/[id]/cancel/route";

function createJsonRequest(url: string, method: string, body?: any, token?: string): NextRequest {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const init: RequestInit = {
    method,
    headers,
  };
  if (body) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, "http://localhost:3000"), init as any);
}

describe("Integration: Authentication & Account API Routes", () => {
  beforeEach(() => {
    AuthDatabase.reset();
  });

  describe("1. POST /api/auth/otp/send", () => {
    it("dispatches OTP for valid email and enforces anti-enumeration response", async () => {
      const req = createJsonRequest("/api/auth/otp/send", "POST", {
        email: "client@aurarealestate.com",
      });
      const res = await sendOtpHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toContain("If your email is valid, a 6-digit verification code has been dispatched.");
      expect(res.headers.get("X-Aura-Test-Code")).toMatch(/^\d{6}$/);
    });

    it("rejects invalid or malformed email address", async () => {
      const req = createJsonRequest("/api/auth/otp/send", "POST", {
        email: "not-an-email",
      });
      const res = await sendOtpHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("Please enter a valid email address.");
    });

    it("enforces 60-second resend cooldown returning 429", async () => {
      const req1 = createJsonRequest("/api/auth/otp/send", "POST", {
        email: "cooldown@aurarealestate.com",
      });
      await sendOtpHandler(req1);

      const req2 = createJsonRequest("/api/auth/otp/send", "POST", {
        email: "cooldown@aurarealestate.com",
      });
      const res2 = await sendOtpHandler(req2);
      const json2 = await res2.json();

      expect(res2.status).toBe(429);
      expect(json2.error).toContain("Please wait");
      expect(json2.cooldownSeconds).toBeGreaterThan(0);
    });
  });

  describe("2. POST /api/auth/otp/verify & POST /api/auth/register", () => {
    it("rejects verification code that is not 6 digits", async () => {
      const req = createJsonRequest("/api/auth/otp/verify", "POST", {
        email: "test@example.com",
        code: "123",
      });
      const res = await verifyOtpHandler(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("Please enter a valid 6-digit verification code.");
    });

    it("reports remaining attempts on incorrect code", async () => {
      const email = "attempts@aurarealestate.com";
      const sendReq = createJsonRequest("/api/auth/otp/send", "POST", { email });
      const sendRes = await sendOtpHandler(sendReq);
      const testCode = sendRes.headers.get("X-Aura-Test-Code");
      const wrongCode = testCode === "111111" ? "222222" : "111111";

      const verifyReq = createJsonRequest("/api/auth/otp/verify", "POST", {
        email,
        code: wrongCode,
      });
      const verifyRes = await verifyOtpHandler(verifyReq);
      const json = await verifyRes.json();

      expect(verifyRes.status).toBe(400);
      expect(json.remainingAttempts).toBe(4);
      expect(json.error).toContain("4 attempts remaining");
    });

    it("establishes session directly for existing user", async () => {
      const email = "lord.sterling@aurarealestate.com";
      AuthDatabase.createUser({
        email,
        fullName: "Lord Julian Sterling",
      });

      const sendReq = createJsonRequest("/api/auth/otp/send", "POST", { email });
      const sendRes = await sendOtpHandler(sendReq);
      const code = sendRes.headers.get("X-Aura-Test-Code");

      const verifyReq = createJsonRequest("/api/auth/otp/verify", "POST", {
        email,
        code,
      });
      const verifyRes = await verifyOtpHandler(verifyReq);
      const json = await verifyRes.json();

      expect(verifyRes.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.isNewUser).toBe(false);
      expect(json.user.fullName).toBe("Lord Julian Sterling");
      expect(json.sessionToken).toBeDefined();

      // Check cookie was set
      const cookieHeader = verifyRes.headers.get("set-cookie");
      expect(cookieHeader).toContain("aura_session=");
      expect(cookieHeader).toContain("HttpOnly");
    });

    it("issues registrationToken for new user and completes profile registration", async () => {
      const email = "new.user@aurarealestate.com";
      const sendReq = createJsonRequest("/api/auth/otp/send", "POST", { email });
      const sendRes = await sendOtpHandler(sendReq);
      const code = sendRes.headers.get("X-Aura-Test-Code");

      const verifyReq = createJsonRequest("/api/auth/otp/verify", "POST", {
        email,
        code,
      });
      const verifyRes = await verifyOtpHandler(verifyReq);
      const verifyJson = await verifyRes.json();

      expect(verifyRes.status).toBe(200);
      expect(verifyJson.isNewUser).toBe(true);
      expect(verifyJson.registrationToken).toBeDefined();

      // Complete profile via /api/auth/register
      const regReq = createJsonRequest("/api/auth/register", "POST", {
        registrationToken: verifyJson.registrationToken,
        fullName: "Duchess Genevieve",
        phone: "+44 20 7946 0555",
      });
      const regRes = await registerHandler(regReq);
      const regJson = await regRes.json();

      expect(regRes.status).toBe(201);
      expect(regJson.success).toBe(true);
      expect(regJson.user.fullName).toBe("Duchess Genevieve");
      expect(regJson.user.email).toBe(email);
      expect(regRes.headers.get("set-cookie")).toContain("aura_session=");
    });
  });

  describe("3. GET /api/auth/me & POST /api/auth/logout", () => {
    it("returns unauthenticated when no session is present", async () => {
      const req = createJsonRequest("/api/auth/me", "GET");
      const res = await meHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.authenticated).toBe(false);
      expect(json.user).toBeNull();
    });

    it("returns user profile when authenticated with Bearer token", async () => {
      const user = AuthDatabase.createUser({
        email: "authed@aurarealestate.com",
        fullName: "Arthur Wellesley",
      });
      const session = AuthDatabase.createSession(user.id);

      const req = createJsonRequest("/api/auth/me", "GET", null, session.token);
      const res = await meHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.authenticated).toBe(true);
      expect(json.user.id).toBe(user.id);
      expect(json.user.fullName).toBe("Arthur Wellesley");
    });

    it("clears session and cookie on POST /api/auth/logout", async () => {
      const user = AuthDatabase.createUser({
        email: "logout@aurarealestate.com",
        fullName: "Arthur Wellesley",
      });
      const session = AuthDatabase.createSession(user.id);

      const req = createJsonRequest("/api/auth/logout", "POST", null, session.token);
      const res = await logoutHandler(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
      expect(AuthDatabase.getSession(session.token)).toBeNull();
    });
  });

  describe("4. Saved Properties API & Cross-Account Isolation", () => {
    it("returns 401 when unauthenticated", async () => {
      const req = createJsonRequest("/api/account/saved", "GET");
      const res = await getSavedHandler(req);
      expect(res.status).toBe(401);
    });

    it("adds, retrieves, and removes saved properties", async () => {
      const user = AuthDatabase.createUser({
        email: "collector@aurarealestate.com",
        fullName: "Collector",
      });
      const session = AuthDatabase.createSession(user.id);

      // Add property
      const addReq = createJsonRequest(
        "/api/account/saved",
        "POST",
        { propertyId: "prop-sale-01" },
        session.token
      );
      const addRes = await postSavedHandler(addReq);
      const addJson = await addRes.json();

      expect(addRes.status).toBe(200);
      expect(addJson.savedIds).toContain("prop-sale-01");

      // Get hydrated properties
      const getReq = createJsonRequest("/api/account/saved", "GET", null, session.token);
      const getRes = await getSavedHandler(getReq);
      const getJson = await getRes.json();

      expect(getRes.status).toBe(200);
      expect(getJson.properties).toHaveLength(1);
      expect(getJson.properties[0].id).toBe("prop-sale-01");

      // Remove property
      const delReq = createJsonRequest(
        "/api/account/saved?propertyId=prop-sale-01",
        "DELETE",
        null,
        session.token
      );
      const delRes = await deleteSavedHandler(delReq);
      const delJson = await delRes.json();

      expect(delRes.status).toBe(200);
      expect(delJson.savedIds).not.toContain("prop-sale-01");
    });

    it("synchronizes and merges guest favorites without duplicates", async () => {
      const user = AuthDatabase.createUser({
        email: "sync@aurarealestate.com",
        fullName: "Sync User",
      });
      const session = AuthDatabase.createSession(user.id);

      AuthDatabase.addSavedProperty(user.id, "prop-sale-01");

      const syncReq = createJsonRequest(
        "/api/account/saved/sync",
        "POST",
        { propertyIds: ["prop-sale-01", "prop-rent-01", "prop-sale-02"] },
        session.token
      );
      const syncRes = await syncSavedHandler(syncReq);
      const syncJson = await syncRes.json();

      expect(syncRes.status).toBe(200);
      expect(syncJson.count).toBe(3);
      expect(syncJson.savedIds).toEqual(
        expect.arrayContaining(["prop-sale-01", "prop-rent-01", "prop-sale-02"])
      );
    });
  });

  describe("5. Viewings API & Cross-Account Isolation", () => {
    it("returns 401 when unauthenticated", async () => {
      const req = createJsonRequest("/api/account/viewings", "GET");
      const res = await getViewingsHandler(req);
      expect(res.status).toBe(401);
    });

    it("schedules a private viewing request with mandatory pending_confirmation status", async () => {
      const user = AuthDatabase.createUser({
        email: "viewing.user@aurarealestate.com",
        fullName: "Lord Arthur",
        phone: "+44 20 7111 2222",
      });
      const session = AuthDatabase.createSession(user.id);

      const postReq = createJsonRequest(
        "/api/account/viewings",
        "POST",
        {
          propertyId: "prop-sale-01",
          tourType: "in-person",
          preferredDate: "2026-12-05",
          preferredTime: "afternoon",
          notes: "Need accessibility ramp info",
        },
        session.token
      );
      const postRes = await postViewingHandler(postReq);
      const postJson = await postRes.json();

      expect(postRes.status).toBe(201);
      expect(postJson.success).toBe(true);
      expect(postJson.viewing.status).toBe("pending_confirmation");
      expect(postJson.viewing.referenceCode).toMatch(/^VS-VR-/);
      expect(postJson.viewing.fullName).toBe("Lord Arthur");
    });

    it("enforces strict cross-account isolation: user cannot cancel another user's viewing", async () => {
      const userAlice = AuthDatabase.createUser({
        email: "alice2@example.com",
        fullName: "Alice Vance",
      });
      const userBob = AuthDatabase.createUser({
        email: "bob2@example.com",
        fullName: "Bob Sterling",
      });

      const sessionBob = AuthDatabase.createSession(userBob.id);

      const aliceViewing = AuthDatabase.createUserViewing(userAlice.id, {
        propertyId: "prop-sale-01",
        propertyTitle: "Penthouse",
        fullName: "Alice Vance",
        email: "alice2@example.com",
        phone: "+44 20 7111 2222",
        tourType: "in-person",
        preferredDate: "2026-12-05",
        preferredTime: "morning",
        status: "pending_confirmation",
        referenceCode: "VS-VR-PROP-1111",
      });

      // Bob attempts to cancel Alice's viewing
      const bobCancelReq = createJsonRequest(
        `/api/account/viewings/${aliceViewing.id}/cancel`,
        "POST",
        null,
        sessionBob.token
      );
      const bobCancelRes = await cancelViewingHandler(bobCancelReq, {
        params: { id: aliceViewing.id },
      });

      expect(bobCancelRes.status).toBe(404);

      // Verify Alice's viewing was not modified
      const checkAliceViewing = AuthDatabase.getUserViewingById(aliceViewing.id, userAlice.id);
      expect(checkAliceViewing?.status).toBe("pending_confirmation");
    });
  });
});
