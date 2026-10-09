create table if not exists public.numbers_leaderboard (
    id bigint generated always as identity primary key,
    player_name text not null check (char_length(player_name) between 1 and 20),
    score integer not null check (score between 0 and 10000),
    elapsed_seconds integer not null check (elapsed_seconds between 1 and 240),
    mistakes integer not null check (mistakes between 0 and 200),
    created_at timestamptz not null default now()
);

alter table public.numbers_leaderboard enable row level security;

drop policy if exists "Anyone can read numbers leaderboard" on public.numbers_leaderboard;
create policy "Anyone can read numbers leaderboard"
    on public.numbers_leaderboard for select
    to anon, authenticated using (true);

drop policy if exists "Anyone can submit numbers score" on public.numbers_leaderboard;
create policy "Anyone can submit numbers score"
    on public.numbers_leaderboard for insert
    to anon, authenticated with check (
        char_length(player_name) between 1 and 20
        and score between 0 and 10000
        and elapsed_seconds between 1 and 240
        and mistakes between 0 and 200
        and score = greatest(0, 1000 - elapsed_seconds * 5 - mistakes * 150)
    );

grant select, insert on public.numbers_leaderboard to anon, authenticated;
grant usage, select on sequence public.numbers_leaderboard_id_seq to anon, authenticated;
