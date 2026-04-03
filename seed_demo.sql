-- =============================================================================
--  MERENDA MVP — DADOS DE DEMONSTRAÇÃO
--  Senha de todos os usuários: senha123
--  Hash pbkdf2_sha256 gerado pelo Django
-- =============================================================================

-- Limpa os dados existentes (ordem inversa das FK)
TRUNCATE TABLE
    merenda_app_alertalog,
    merenda_app_cardapio_refeicao,
    merenda_app_cardapio,
    merenda_app_restricoes_alunos,
    merenda_app_restricoes_alimentares,
    merenda_app_refeicao_ingrediente,
    merenda_app_refeicao_refalergias,
    merenda_app_refeicao,
    merenda_app_alergia,
    merenda_app_ingrediente,
    merenda_app_aluno,
    merenda_app_nutricionista,
    merenda_app_pais
RESTART IDENTITY CASCADE;

-- =============================================================================
-- 1. NUTRICIONISTAS (3 registros)
-- =============================================================================
INSERT INTO merenda_app_nutricionista
  (dt_created, dt_modified, cs_active, nutnome, nutemail, nutsenha)
VALUES
  (NOW(), NOW(), TRUE, 'Dra. Beatriz Santos',    'beatriz@escola.edu.br',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM'),
  (NOW(), NOW(), TRUE, 'Dr. Rafael Mendes',      'rafael@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM'),
  (NOW(), NOW(), TRUE, 'Dra. Camila Oliveira',   'camila@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM');

-- =============================================================================
-- 2. PAIS / RESPONSÁVEIS (20 registros)
-- =============================================================================
INSERT INTO merenda_app_pais
  (dt_created, dt_modified, cs_active, painome, paiemail, paisenha, paicpf)
VALUES
  (NOW(), NOW(), TRUE, 'Carlos Eduardo Silva',    'carlos.silva@gmail.com',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111101'),
  (NOW(), NOW(), TRUE, 'Ana Paula Rocha',         'ana.rocha@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111102'),
  (NOW(), NOW(), TRUE, 'Marcos Ferreira',         'marcos.f@hotmail.com',     'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111103'),
  (NOW(), NOW(), TRUE, 'Juliana Martins',         'juliana.m@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111104'),
  (NOW(), NOW(), TRUE, 'Roberto Alves',           'roberto.alves@gmail.com',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111105'),
  (NOW(), NOW(), TRUE, 'Fernanda Costa',          'fernanda.c@outlook.com',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111106'),
  (NOW(), NOW(), TRUE, 'André Lima',              'andre.lima@gmail.com',     'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111107'),
  (NOW(), NOW(), TRUE, 'Patricia Souza',          'patricia.s@gmail.com',     'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111108'),
  (NOW(), NOW(), TRUE, 'Gustavo Pereira',         'gustavo.p@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111109'),
  (NOW(), NOW(), TRUE, 'Luciana Carvalho',        'luciana.c@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111110'),
  (NOW(), NOW(), TRUE, 'Paulo Henrique',          'paulo.h@gmail.com',        'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111111'),
  (NOW(), NOW(), TRUE, 'Silvia Regina',           'silvia.r@gmail.com',       'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111112'),
  (NOW(), NOW(), TRUE, 'Pedro Nascimento',        'pedro.n@gmail.com',        'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111113'),
  (NOW(), NOW(), TRUE, 'Mariana Dias',            'mariana.d@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111114'),
  (NOW(), NOW(), TRUE, 'Leandro Barbosa',         'leandro.b@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111115'),
  (NOW(), NOW(), TRUE, 'Cristiane Pinto',         'cristiane.p@gmail.com',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111116'),
  (NOW(), NOW(), TRUE, 'Diego Monteiro',          'diego.m@gmail.com',        'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111117'),
  (NOW(), NOW(), TRUE, 'Tatiana Freitas',         'tatiana.f@gmail.com',      'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111118'),
  (NOW(), NOW(), TRUE, 'Felipe Gomes',            'felipe.g@gmail.com',       'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111119'),
  (NOW(), NOW(), TRUE, 'Renata Campos',           'renata.c@gmail.com',       'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '11111111120');

-- =============================================================================
-- 3. ALUNOS (20 registros, vinculados aos pais acima via paicodigo 1..20)
-- =============================================================================
INSERT INTO merenda_app_aluno
  (dt_created, dt_modified, cs_active, alunome, aluemail, alusenha, alumatricula, alucpf, aluidade, alupaicodigo)
VALUES
  (NOW(), NOW(), TRUE, 'Lucas Silva',          'lucas.s@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024001', '22222222201', 10, 1),
  (NOW(), NOW(), TRUE, 'Isabela Rocha',        'isabela.r@escola.edu.br',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024002', '22222222202',  9, 2),
  (NOW(), NOW(), TRUE, 'Gabriel Ferreira',     'gabriel.f@escola.edu.br',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024003', '22222222203', 11, 3),
  (NOW(), NOW(), TRUE, 'Sofia Martins',        'sofia.m@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024004', '22222222204',  8, 4),
  (NOW(), NOW(), TRUE, 'Enzo Alves',           'enzo.a@escola.edu.br',     'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024005', '22222222205', 12, 5),
  (NOW(), NOW(), TRUE, 'Valentina Costa',      'valentina.c@escola.edu.br','argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024006', '22222222206',  7, 6),
  (NOW(), NOW(), TRUE, 'Miguel Lima',          'miguel.l@escola.edu.br',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024007', '22222222207', 10, 7),
  (NOW(), NOW(), TRUE, 'Laura Souza',          'laura.s@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024008', '22222222208',  9, 8),
  (NOW(), NOW(), TRUE, 'Arthur Pereira',       'arthur.p@escola.edu.br',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024009', '22222222209', 11, 9),
  (NOW(), NOW(), TRUE, 'Alice Carvalho',       'alice.c@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024010', '22222222210',  8,10),
  (NOW(), NOW(), TRUE, 'Heitor Henrique',      'heitor.h@escola.edu.br',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024011', '22222222211', 12,11),
  (NOW(), NOW(), TRUE, 'Manuela Regina',       'manuela.r@escola.edu.br',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024012', '22222222212',  7,12),
  (NOW(), NOW(), TRUE, 'Davi Nascimento',      'davi.n@escola.edu.br',     'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024013', '22222222213', 10,13),
  (NOW(), NOW(), TRUE, 'Giovanna Dias',        'giovanna.d@escola.edu.br', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024014', '22222222214',  9,14),
  (NOW(), NOW(), TRUE, 'Pietro Barbosa',       'pietro.b@escola.edu.br',   'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024015', '22222222215', 11,15),
  (NOW(), NOW(), TRUE, 'Lívia Pinto',          'livia.p@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024016', '22222222216',  8,16),
  (NOW(), NOW(), TRUE, 'Bernardo Monteiro',    'bernardo.m@escola.edu.br', 'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024017', '22222222217', 12,17),
  (NOW(), NOW(), TRUE, 'Cecília Freitas',      'cecilia.f@escola.edu.br',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024018', '22222222218',  7,18),
  (NOW(), NOW(), TRUE, 'Nicolas Gomes',        'nicolas.g@escola.edu.br',  'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024019', '22222222219', 10,19),
  (NOW(), NOW(), TRUE, 'Clara Campos',         'clara.c@escola.edu.br',    'argon2$argon2id$v=19$m=102400,t=2,p=8$Mkh1TFhiV2Uxdnpqb1Y5TkdUeTlmcw$dG5P1a/ZpLWKxwXzPpL/R4Tpm3C1d3mWq+UCI8UjHLM', '2024020', '22222222220',  9,20);

-- =============================================================================
-- 4. INGREDIENTES (20 registros)
-- =============================================================================
INSERT INTO merenda_app_ingrediente (dt_created, dt_modified, cs_active, ingtipo) VALUES
  (NOW(), NOW(), TRUE, 'Arroz'),
  (NOW(), NOW(), TRUE, 'Feijão'),
  (NOW(), NOW(), TRUE, 'Frango'),
  (NOW(), NOW(), TRUE, 'Carne Bovina'),
  (NOW(), NOW(), TRUE, 'Macarrão'),
  (NOW(), NOW(), TRUE, 'Leite'),
  (NOW(), NOW(), TRUE, 'Queijo'),
  (NOW(), NOW(), TRUE, 'Ovo'),
  (NOW(), NOW(), TRUE, 'Tomate'),
  (NOW(), NOW(), TRUE, 'Cebola'),
  (NOW(), NOW(), TRUE, 'Alho'),
  (NOW(), NOW(), TRUE, 'Cenoura'),
  (NOW(), NOW(), TRUE, 'Batata'),
  (NOW(), NOW(), TRUE, 'Azeite de Oliva'),
  (NOW(), NOW(), TRUE, 'Farinha de Trigo'),
  (NOW(), NOW(), TRUE, 'Açúcar'),
  (NOW(), NOW(), TRUE, 'Sal'),
  (NOW(), NOW(), TRUE, 'Pão'),
  (NOW(), NOW(), TRUE, 'Manteiga'),
  (NOW(), NOW(), TRUE, 'Espinafre');

-- =============================================================================
-- 5. ALERGIAS (10 registros)
-- =============================================================================
INSERT INTO merenda_app_alergia (dt_created, dt_modified, cs_active, aletipo) VALUES
  (NOW(), NOW(), TRUE, 'Glúten'),
  (NOW(), NOW(), TRUE, 'Lactose'),
  (NOW(), NOW(), TRUE, 'Ovo'),
  (NOW(), NOW(), TRUE, 'Soja'),
  (NOW(), NOW(), TRUE, 'Amendoim'),
  (NOW(), NOW(), TRUE, 'Frutos do Mar'),
  (NOW(), NOW(), TRUE, 'Nozes'),
  (NOW(), NOW(), TRUE, 'Peixe'),
  (NOW(), NOW(), TRUE, 'Gergelim'),
  (NOW(), NOW(), TRUE, 'Mostarda');

-- =============================================================================
-- 6. RESTRIÇÕES ALIMENTARES — ingrediente que contém alergia (20 registros)
--    Relaciona Alergia (resali_alecodigo) → Ingrediente (resali_ingcodigo)
-- =============================================================================
INSERT INTO merenda_app_restricoes_alimentares
  (dt_created, dt_modified, cs_active, resali_alecodigo, resali_ingcodigo)
VALUES
  -- Glúten (1) → Farinha de Trigo (15), Macarrão (5), Pão (18)
  (NOW(), NOW(), TRUE, 1, 15),
  (NOW(), NOW(), TRUE, 1,  5),
  (NOW(), NOW(), TRUE, 1, 18),
  -- Lactose (2) → Leite (6), Queijo (7), Manteiga (19)
  (NOW(), NOW(), TRUE, 2,  6),
  (NOW(), NOW(), TRUE, 2,  7),
  (NOW(), NOW(), TRUE, 2, 19),
  -- Ovo (3) → Ovo (8)
  (NOW(), NOW(), TRUE, 3,  8),
  -- Soja (4) → Azeite de Oliva (14) [representativo]
  (NOW(), NOW(), TRUE, 4, 14),
  -- Amendoim (5) → Açúcar (16) [representativo]
  (NOW(), NOW(), TRUE, 5, 16),
  -- Frutos do Mar (6) → Sal (17) [representativo]
  (NOW(), NOW(), TRUE, 6, 17),
  -- Nozes (7) → Espinafre (20) [representativo]
  (NOW(), NOW(), TRUE, 7, 20),
  -- Peixe (8) → Alho (11)
  (NOW(), NOW(), TRUE, 8, 11),
  -- Gergelim (9) → Cebola (10)
  (NOW(), NOW(), TRUE, 9, 10),
  -- Mostarda (10) → Tomate (9)
  (NOW(), NOW(), TRUE,10,  9),
  -- Glúten (1) e Batata (13)
  (NOW(), NOW(), TRUE, 1, 13),
  -- Lactose (2) e Ovo (8)
  (NOW(), NOW(), TRUE, 2,  8),
  -- Ovo (3) e Manteiga (19)
  (NOW(), NOW(), TRUE, 3, 19),
  -- Glúten (1) e Arroz (1)
  (NOW(), NOW(), TRUE, 1,  1),
  -- Lactose (2) e Arroz (1)
  (NOW(), NOW(), TRUE, 2,  2),
  -- Peixe (8) e Cenoura (12)
  (NOW(), NOW(), TRUE, 8, 12);

-- =============================================================================
-- 7. RESTRIÇÕES DE ALUNOS — aluno com alergia (20 registros)
-- =============================================================================
INSERT INTO merenda_app_restricoes_alunos
  (dt_created, dt_modified, cs_active, resalu_alucodigo, resalu_alecodigo)
VALUES
  (NOW(), NOW(), TRUE,  1, 1),  -- Lucas → Glúten
  (NOW(), NOW(), TRUE,  1, 2),  -- Lucas → Lactose
  (NOW(), NOW(), TRUE,  2, 2),  -- Isabela → Lactose
  (NOW(), NOW(), TRUE,  3, 3),  -- Gabriel → Ovo
  (NOW(), NOW(), TRUE,  4, 1),  -- Sofia → Glúten
  (NOW(), NOW(), TRUE,  5, 4),  -- Enzo → Soja
  (NOW(), NOW(), TRUE,  6, 5),  -- Valentina → Amendoim
  (NOW(), NOW(), TRUE,  7, 2),  -- Miguel → Lactose
  (NOW(), NOW(), TRUE,  8, 3),  -- Laura → Ovo
  (NOW(), NOW(), TRUE,  9, 1),  -- Arthur → Glúten
  (NOW(), NOW(), TRUE, 10, 6),  -- Alice → Frutos do Mar
  (NOW(), NOW(), TRUE, 11, 7),  -- Heitor → Nozes
  (NOW(), NOW(), TRUE, 12, 8),  -- Manuela → Peixe
  (NOW(), NOW(), TRUE, 13, 1),  -- Davi → Glúten
  (NOW(), NOW(), TRUE, 14, 2),  -- Giovanna → Lactose
  (NOW(), NOW(), TRUE, 15, 9),  -- Pietro → Gergelim
  (NOW(), NOW(), TRUE, 16,10),  -- Lívia → Mostarda
  (NOW(), NOW(), TRUE, 17, 3),  -- Bernardo → Ovo
  (NOW(), NOW(), TRUE, 18, 4),  -- Cecília → Soja
  (NOW(), NOW(), TRUE, 19, 5);  -- Nicolas → Amendoim

-- =============================================================================
-- 8. REFEIÇÕES (20 registros, todos vinculados à nutricionista 1)
-- =============================================================================
INSERT INTO merenda_app_refeicao
  (dt_created, dt_modified, cs_active, refnome, refnutcodigo, refproteina, refcarboidrato, refcalorias, refimagem)
VALUES
  (NOW(), NOW(), TRUE, 'Arroz com Frango Grelhado',     1, 30, 55, 480, NULL),
  (NOW(), NOW(), TRUE, 'Macarrão à Bolonhesa',           1, 22, 65, 520, NULL),
  (NOW(), NOW(), TRUE, 'Feijão com Arroz e Bife',        1, 35, 60, 550, NULL),
  (NOW(), NOW(), TRUE, 'Sopa de Legumes',                1, 10, 30, 200, NULL),
  (NOW(), NOW(), TRUE, 'Frango com Batata Assada',       1, 28, 45, 420, NULL),
  (NOW(), NOW(), TRUE, 'Omelete de Queijo',              1, 18, 10, 280, NULL),
  (NOW(), NOW(), TRUE, 'Vitamina de Leite com Frutas',  1,  8, 35, 220, NULL),
  (NOW(), NOW(), TRUE, 'Salada de Cenoura com Ovo',      1, 12, 15, 180, NULL),
  (NOW(), NOW(), TRUE, 'Pão com Manteiga e Suco',        1,  6, 40, 280, NULL),
  (NOW(), NOW(), TRUE, 'Carne Moída com Arroz',          1, 32, 58, 510, NULL),
  (NOW(), NOW(), TRUE, 'Macarrão com Molho de Tomate',   1, 14, 70, 430, NULL),
  (NOW(), NOW(), TRUE, 'Frango Refogado com Espinafre',  1, 26, 20, 310, NULL),
  (NOW(), NOW(), TRUE, 'Arroz Integral com Feijão',      1, 18, 65, 400, NULL),
  (NOW(), NOW(), TRUE, 'Strogonoff de Frango',           1, 24, 30, 390, NULL),
  (NOW(), NOW(), TRUE, 'Purê de Batata com Bife',        1, 30, 50, 490, NULL),
  (NOW(), NOW(), TRUE, 'Sopa de Macarrão',               1, 12, 45, 310, NULL),
  (NOW(), NOW(), TRUE, 'Torta de Frango',                1, 22, 40, 420, NULL),
  (NOW(), NOW(), TRUE, 'Salada de Ovo com Tomate',       1, 14, 12, 200, NULL),
  (NOW(), NOW(), TRUE, 'Arroz com Cenoura e Ovo Cozido', 1, 16, 50, 360, NULL),
  (NOW(), NOW(), TRUE, 'Suco de Laranja com Pão Integral',1,  4, 45, 230, NULL);

-- =============================================================================
-- 9. INGREDIENTES DAS REFEIÇÕES (tabela many-to-many) — 20+ registros
-- =============================================================================
INSERT INTO merenda_app_refeicao_ingrediente
  (dt_created, dt_modified, cs_active, refing_refcodigo, refing_ingcodigo)
VALUES
  -- Ref 1: Arroz com Frango (Arroz, Frango, Alho, Cebola, Azeite)
  (NOW(), NOW(), TRUE, 1, 1), (NOW(), NOW(), TRUE, 1, 3), (NOW(), NOW(), TRUE, 1,11), (NOW(), NOW(), TRUE, 1,10), (NOW(), NOW(), TRUE, 1,14),
  -- Ref 2: Macarrão à Bolonhesa (Macarrão, Carne, Tomate, Cebola, Queijo)
  (NOW(), NOW(), TRUE, 2, 5), (NOW(), NOW(), TRUE, 2, 4), (NOW(), NOW(), TRUE, 2, 9), (NOW(), NOW(), TRUE, 2,10), (NOW(), NOW(), TRUE, 2, 7),
  -- Ref 3: Feijão, Arroz, Bife (Feijão, Arroz, Carne, Alho, Cebola)
  (NOW(), NOW(), TRUE, 3, 2), (NOW(), NOW(), TRUE, 3, 1), (NOW(), NOW(), TRUE, 3, 4), (NOW(), NOW(), TRUE, 3,11), (NOW(), NOW(), TRUE, 3,10),
  -- Ref 4: Sopa (Cenoura, Batata, Cebola, Alho, Sal)
  (NOW(), NOW(), TRUE, 4,12), (NOW(), NOW(), TRUE, 4,13), (NOW(), NOW(), TRUE, 4,10), (NOW(), NOW(), TRUE, 4,11), (NOW(), NOW(), TRUE, 4,17);

-- Alergia das refeições (ManyToMany automático pelo Django: merenda_app_refeicao_refalergias)
-- Ref 2 (Macarrão à Bolonhesa): contém Glúten(1) e Lactose(2)
INSERT INTO merenda_app_refeicao_refalergias (refeicao_id, alergia_id) VALUES
  (2, 1),  -- Macarrão → Glúten
  (2, 2),  -- Macarrão → Lactose
  (6, 2),  -- Omelete → Lactose
  (6, 3),  -- Omelete → Ovo
  (7, 2),  -- Vitamina → Lactose
  (9, 1),  -- Pão → Glúten
  (9, 2),  -- Pão → Lactose
  (11, 1), -- Macarrão Tomate → Glúten
  (16, 1), -- Sopa Macarrão → Glúten
  (17, 1), -- Torta Frango → Glúten
  (17, 2); -- Torta Frango → Lactose

-- =============================================================================
-- 10. CARDÁPIOS — uma semana completa (dias úteis de 2026-03-02 a 2026-03-06)
--     + semana anterior + mais dois dias próximos
-- =============================================================================
INSERT INTO merenda_app_cardapio (dt_created, dt_modified, cs_active, cardata) VALUES
  (NOW(), NOW(), TRUE, '2026-03-02 12:00:00'),  -- 1 Segunda
  (NOW(), NOW(), TRUE, '2026-03-03 12:00:00'),  -- 2 Terça
  (NOW(), NOW(), TRUE, '2026-03-04 12:00:00'),  -- 3 Quarta
  (NOW(), NOW(), TRUE, '2026-03-05 12:00:00'),  -- 4 Quinta
  (NOW(), NOW(), TRUE, '2026-03-06 12:00:00'),  -- 5 Sexta
  (NOW(), NOW(), TRUE, '2026-02-23 12:00:00'),  -- 6 Seg semana anterior
  (NOW(), NOW(), TRUE, '2026-02-24 12:00:00'),  -- 7 Ter semana anterior
  (NOW(), NOW(), TRUE, '2026-02-25 12:00:00'),  -- 8 Qua semana anterior
  (NOW(), NOW(), TRUE, '2026-02-26 12:00:00'),  -- 9 Qui semana anterior
  (NOW(), NOW(), TRUE, '2026-02-27 12:00:00'),  -- 10 Sex semana anterior
  (NOW(), NOW(), TRUE, '2026-03-09 12:00:00'),  -- 11 Próxima semana
  (NOW(), NOW(), TRUE, '2026-03-10 12:00:00'),  -- 12 Próxima semana
  (NOW(), NOW(), TRUE, '2026-03-11 12:00:00'),  -- 13 Próxima semana
  (NOW(), NOW(), TRUE, '2026-03-12 12:00:00'),  -- 14 Próxima semana
  (NOW(), NOW(), TRUE, '2026-03-13 12:00:00'),  -- 15 Próxima semana
  (NOW(), NOW(), TRUE, '2026-03-16 12:00:00'),  -- 16
  (NOW(), NOW(), TRUE, '2026-03-17 12:00:00'),  -- 17
  (NOW(), NOW(), TRUE, '2026-03-18 12:00:00'),  -- 18
  (NOW(), NOW(), TRUE, '2026-03-19 12:00:00'),  -- 19
  (NOW(), NOW(), TRUE, '2026-03-20 12:00:00');  -- 20

-- =============================================================================
-- 11. CARDÁPIO-REFEIÇÃO — vincula refeições aos dias do cardápio
-- =============================================================================
INSERT INTO merenda_app_cardapio_refeicao
  (dt_created, dt_modified, cs_active, carref_carcodigo, carref_refcodigo)
VALUES
  -- Semana 02/03 a 06/03
  (NOW(), NOW(), TRUE, 1,  1), (NOW(), NOW(), TRUE, 1,  4),  -- Seg: Arroz Frango + Sopa
  (NOW(), NOW(), TRUE, 2,  2), (NOW(), NOW(), TRUE, 2,  8),  -- Ter: Macarrão + Salada Cenoura
  (NOW(), NOW(), TRUE, 3,  3), (NOW(), NOW(), TRUE, 3, 12),  -- Qua: Feijão Bife + Frango Espinafre
  (NOW(), NOW(), TRUE, 4,  5), (NOW(), NOW(), TRUE, 4, 19),  -- Qui: Batata Frango + Arroz Cenoura
  (NOW(), NOW(), TRUE, 5, 10), (NOW(), NOW(), TRUE, 5, 20),  -- Sex: Carne Arroz + Suco Pão
  -- Semana anterior
  (NOW(), NOW(), TRUE, 6,  6), (NOW(), NOW(), TRUE, 6,  9),
  (NOW(), NOW(), TRUE, 7,  7), (NOW(), NOW(), TRUE, 7, 13),
  (NOW(), NOW(), TRUE, 8,  2), (NOW(), NOW(), TRUE, 8, 18),
  (NOW(), NOW(), TRUE, 9, 14), (NOW(), NOW(), TRUE, 9,  4),
  (NOW(), NOW(), TRUE,10, 15), (NOW(), NOW(), TRUE,10, 20),
  -- Próximas semanas
  (NOW(), NOW(), TRUE,11,  1), (NOW(), NOW(), TRUE,11,  7),
  (NOW(), NOW(), TRUE,12, 11), (NOW(), NOW(), TRUE,12,  8),
  (NOW(), NOW(), TRUE,13, 16), (NOW(), NOW(), TRUE,13, 12),
  (NOW(), NOW(), TRUE,14, 17), (NOW(), NOW(), TRUE,14,  4),
  (NOW(), NOW(), TRUE,15,  3), (NOW(), NOW(), TRUE,15, 20);

-- =============================================================================
-- 12. ALERTAS DE LOG — registro de alertas de alergia gerados (20 registros)
-- =============================================================================
INSERT INTO merenda_app_alertalog
  (dt_created, dt_modified, cs_active, logalunocodigo, logalecodigo, logrefcodigo, logvisualizacao)
VALUES
  (NOW(), NOW(), TRUE,  1, 1,  2, TRUE),   -- Lucas/Glúten/Macarrão — visto
  (NOW(), NOW(), TRUE,  1, 2,  2, TRUE),   -- Lucas/Lactose/Macarrão — visto
  (NOW(), NOW(), TRUE,  2, 2,  7, FALSE),  -- Isabela/Lactose/Vitamina — não visto
  (NOW(), NOW(), TRUE,  3, 3,  6, FALSE),  -- Gabriel/Ovo/Omelete
  (NOW(), NOW(), TRUE,  4, 1,  9, TRUE),   -- Sofia/Glúten/Pão
  (NOW(), NOW(), TRUE,  5, 4,  1, FALSE),  -- Enzo/Soja/Arroz Frango
  (NOW(), NOW(), TRUE,  7, 2,  7, TRUE),   -- Miguel/Lactose/Vitamina
  (NOW(), NOW(), TRUE,  8, 3,  6, FALSE),  -- Laura/Ovo/Omelete
  (NOW(), NOW(), TRUE,  9, 1,  2, TRUE),   -- Arthur/Glúten/Macarrão
  (NOW(), NOW(), TRUE,  9, 1, 11, FALSE),  -- Arthur/Glúten/Macarrão Tomate
  (NOW(), NOW(), TRUE, 13, 1,  9, TRUE),   -- Davi/Glúten/Pão
  (NOW(), NOW(), TRUE, 14, 2,  7, FALSE),  -- Giovanna/Lactose/Vitamina
  (NOW(), NOW(), TRUE, 17, 3,  6, TRUE),   -- Bernardo/Ovo/Omelete
  (NOW(), NOW(), TRUE,  1, 1, 11, FALSE),  -- Lucas/Glúten/Macarrão Tomate
  (NOW(), NOW(), TRUE,  1, 1, 16, FALSE),  -- Lucas/Glúten/Sopa Macarrão
  (NOW(), NOW(), TRUE,  4, 1, 17, TRUE),   -- Sofia/Glúten/Torta Frango
  (NOW(), NOW(), TRUE,  4, 1, 11, FALSE),  -- Sofia/Glúten/Macarrão Tomate
  (NOW(), NOW(), TRUE,  2, 2,  6, TRUE),   -- Isabela/Lactose/Omelete
  (NOW(), NOW(), TRUE,  2, 2,  9, FALSE),  -- Isabela/Lactose/Pão
  (NOW(), NOW(), TRUE,  7, 2,  9, TRUE);   -- Miguel/Lactose/Pão

-- =============================================================================
--  FIM DO SEED
-- =============================================================================

SELECT 'Seed concluído com sucesso!' AS status;
