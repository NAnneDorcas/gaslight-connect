import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const formData = JSON.parse(event.body || "{}");

    const teamSlug = process.env.TEAM_SLUG || "TEAM_SLUG";

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        team_slug: teamSlug,
        source: "ai-web-2026",
        form_data: formData,
      })
      .select("id")
      .single();

    if (error) throw error;

    await resend.emails.send({
      from: "ClearContent CMS <onboarding@resend.dev>",
      to: process.env.INQUIRY_TO_EMAIL!,
      subject: `[AI-WEB-2026] ${teamSlug} New contact request`,
      text: `
New contact request

Inquiry ID: ${data.id}

Submitted fields:
${JSON.stringify(formData, null, 2)}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        inquiryId: data.id,
        message: "Thank you for your message. We will contact you shortly.",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};