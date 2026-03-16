-- Crear usuario admin para el panel web (frontedweb_admin)
-- Email: admin@admin.com | Contraseña: admin123
-- Ejecutar: PGPASSWORD=postgres123 psql -h localhost -U admin -d applicationfood -f seed_admin.sql
--
-- NOTA: Para datos completos (admin, merchant, tienda, productos) usa el seed de Prisma:
--   cd BackendAdminweb && npx prisma db seed

DO $$
DECLARE
  v_user_id uuid;
  v_role_id uuid;
BEGIN
  -- Insertar usuario si no existe
  INSERT INTO users (id, email, password_hash, auth_provider, first_name, last_name, status, is_phone_verified, is_email_verified, created_at, updated_at)
  SELECT gen_random_uuid(), 'admin@admin.com', '$2b$10$heowr1CN6zDHEC10OVVMv.Di5B3Uzt9adKHYUqFavOClTjxHft40m', 'email', 'Admin', 'Sistema', 'active', false, true, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@admin.com')
  RETURNING id INTO v_user_id;

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@admin.com' LIMIT 1;
  END IF;

  SELECT id INTO v_role_id FROM roles WHERE code = 'admin' LIMIT 1;

  IF v_user_id IS NOT NULL AND v_role_id IS NOT NULL THEN
    INSERT INTO user_roles (id, user_id, role_id, scope_type, created_at)
    SELECT gen_random_uuid(), v_user_id, v_role_id, 'platform', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_user_id AND role_id = v_role_id AND scope_type = 'platform');
  END IF;
END $$;
