import { NextRequest, NextResponse } from "next/server";

/**
 * Mock EHR write-back endpoint simulating FHIR resource creation
 * In production, this would write to Athenahealth, eClinicalWorks, or NextGen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, patient, coverage, consents, answers } = body;

    // Validate required fields
    if (!sessionId || !patient) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate FHIR resource IDs that would be returned by EHR
    const mockResponse = {
      ok: true,
      writtenResources: [
        {
          resourceType: "Patient",
          id: `Patient/${sessionId}-patient`,
          status: "created",
        },
        {
          resourceType: "Coverage",
          id: `Coverage/${sessionId}-coverage`,
          status: "created",
        },
        {
          resourceType: "DocumentReference",
          id: `DocumentReference/${sessionId}-consents`,
          status: "created",
          contentUrl: `https://demo.intakepal.ai/documents/${sessionId}-consents.pdf`,
        },
        {
          resourceType: "QuestionnaireResponse",
          id: `QuestionnaireResponse/${sessionId}-intake`,
          status: "created",
        },
      ],
      timestamp: new Date().toISOString(),
    };

    // Log for demo purposes
    console.log("[DEMO] EHR Write-back:", {
      sessionId,
      patient: `${patient.firstName} ${patient.lastName}`,
      resources: mockResponse.writtenResources.length,
      consents: Object.keys(consents || {}).length,
      answers: Object.keys(answers || {}).length,
    });

    // Simulate what would be written to audit log
    console.log("[DEMO] Audit Event:", {
      action: "EHR_WRITEBACK",
      actor: "system",
      entity: "intake_session",
      entityId: sessionId,
      timestamp: mockResponse.timestamp,
      success: true,
    });

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error) {
    console.error("[DEMO] EHR write-back error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
