create table if not exists public.race_leaderboard (
    id bigint generated always as identity primary key,
    player_name text not null check (char_length(player_name) between 1 and 20),
    score integer not null check (score between 0 and 1300),
    elapsed_seconds integer not null check (elapsed_seconds between 1 and 86400),
    correct_answers integer not null check (correct_answers between 0 and 10),
    mistakes integer not null check (mistakes between 0 and 10),
    final_rank integer not null check (final_rank between 1 and 10),
    created_at timestamptz not null default now(),
    check (correct_answers + mistakes between 1 and 10),
    check (score = greatest(0, correct_answers * 100 + greatest(0, 300 - elapsed_seconds) - mistakes * 150))
);

alter table public.race_leaderboard enable row level security;

drop policy if exists "Anyone can read race leaderboard" on public.race_leaderboard;
create policy "Anyone can read race leaderboard"
    on public.race_leaderboard for select
    to anon, authenticated using (true);

drop policy if exists "Anyone can submit race score" on public.race_leaderboard;
create policy "Anyone can submit race score"
    on public.race_leaderboard for insert
    to anon, authenticated with check (
        char_length(player_name) between 1 and 20
        and score between 0 and 1300
        and elapsed_seconds between 1 and 86400
        and correct_answers between 0 and 10
        and mistakes between 0 and 10
        and correct_answers + mistakes between 1 and 10
        and final_rank between 1 and 10
        and score = greatest(0, correct_answers * 100 + greatest(0, 300 - elapsed_seconds) - mistakes * 150)
    );

grant select, insert on public.race_leaderboard to anon, authenticated;
grant usage, select on sequence public.race_leaderboard_id_seq to anon, authenticated;
