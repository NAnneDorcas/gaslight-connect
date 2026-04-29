
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_cms_user(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten contact submission policy (no longer "always true")
DROP POLICY "anyone submit contact" ON public.contact_submissions;
CREATE POLICY "submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (jsonb_typeof(payload) = 'object');
