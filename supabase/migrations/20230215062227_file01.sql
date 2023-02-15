create table "public"."transactions" (
    "request_transaction_hash" text not null,
    "created_at" timestamp with time zone default now(),
    "response_transaction_hash" text,
    "query_id" text,
    "deliver_status" bigint default '0'::bigint,
    "sender" text,
    "chain_id" bigint
);


alter table "public"."transactions" enable row level security;

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (request_transaction_hash);

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";


