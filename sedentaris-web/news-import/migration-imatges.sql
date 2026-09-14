-- Importació de notícies històriques: galeria d'imatges per post.
-- Executar al SQL Editor de Supabase ABANS de 04_import.mjs --apply.
--
-- imatge_url es manté com a portada (= imatges[1]) perquè targetes, SEO i
-- backoffice continuïn funcionant sense canvis.

alter table public.posts
  add column if not exists imatges text[];

-- El slug identifica el post a la URL; únic evita duplicats si la importació es repeteix.
create unique index if not exists posts_slug_key on public.posts (slug);
