import { NextRequest, NextResponse } from "next/server";

/**
 * Mock eligibility endpoint simulating X12 270/271 clearinghouse response
 * Returns deterministic eligibility data for demo purposes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, payerId, memberId, dob, serviceType } = body;

    // Validate required fields
    if (!sessionId || !payerId || !memberId || !dob) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response simulating 271 response
    const mockResponse = {
      ok: true,
      status: "active",
      copay: "35.00",
      deductible: "500.00",
      deductibleMet: "250.00",
      oopMax: "3000.00",
      oopMet: "800.00",
      notes: "PCP not required. Specialist copay $50.",
      effectiveDate: "2025-01-01",
      terminationDate: null,
      planType: "PPO",
      raw271: {
        // Simulated X12 271 excerpt
        tradingPartnerServiceId: "BCBS-FL",
        subscriberId: memberId,
        groupNumber: "GRP-999",
        planCoverageDescription: "Blue Cross Blue Shield PPO",
      },
    };

    // Log for demo purposes (in production, use proper observability)
    console.log("[DEMO] Eligibility check:", {
      sessionId,
      payerId,
      memberId,
      result: mockResponse.status,
    });

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error) {
    console.error("[DEMO] Eligibility error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
