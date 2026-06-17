--
-- PostgreSQL database dump
--

\restrict UnIUHDffb82PTB7x1x0ycUgN7diz03zIUIpMlX6wp0bksQzlCcRGkNqGtyfpZRq

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CanonicalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CanonicalStatus" AS ENUM (
    'DRAFT',
    'CANON',
    'NON_CANON',
    'RETCONNED'
);


ALTER TYPE public."CanonicalStatus" OWNER TO postgres;

--
-- Name: CharacterStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CharacterStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'INACTIVE',
    'ARCHIVED'
);


ALTER TYPE public."CharacterStatus" OWNER TO postgres;

--
-- Name: ContentVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContentVisibility" AS ENUM (
    'PRIVATE',
    'WORLD',
    'PUBLIC'
);


ALTER TYPE public."ContentVisibility" OWNER TO postgres;

--
-- Name: GeneratedContentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GeneratedContentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."GeneratedContentStatus" OWNER TO postgres;

--
-- Name: InvitationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvitationStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'REVOKED',
    'EXPIRED'
);


ALTER TYPE public."InvitationStatus" OWNER TO postgres;

--
-- Name: JoinRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JoinRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."JoinRequestStatus" OWNER TO postgres;

--
-- Name: JournalVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JournalVisibility" AS ENUM (
    'PRIVATE',
    'WORLD',
    'PUBLIC'
);


ALTER TYPE public."JournalVisibility" OWNER TO postgres;

--
-- Name: LocationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LocationType" AS ENUM (
    'REGION',
    'CITY',
    'LANDMARK',
    'BUILDING',
    'ROOM',
    'OTHER'
);


ALTER TYPE public."LocationType" OWNER TO postgres;

--
-- Name: LoreCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoreCategory" AS ENUM (
    'LOCATION',
    'CULTURE',
    'HISTORY',
    'RULE',
    'ORGANIZATION',
    'ITEM',
    'CHARACTER',
    'EVENT',
    'OTHER'
);


ALTER TYPE public."LoreCategory" OWNER TO postgres;

--
-- Name: MapStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MapStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


ALTER TYPE public."MapStatus" OWNER TO postgres;

--
-- Name: MembershipStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MembershipStatus" AS ENUM (
    'INVITED',
    'ACTIVE',
    'DECLINED',
    'LEFT',
    'REMOVED'
);


ALTER TYPE public."MembershipStatus" OWNER TO postgres;

--
-- Name: MemorySourceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MemorySourceType" AS ENUM (
    'MANUAL',
    'SCENE_POST',
    'LORE_ENTRY',
    'JOURNAL_ENTRY',
    'SUMMARY'
);


ALTER TYPE public."MemorySourceType" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INVITATION',
    'MENTION',
    'SCENE_POST',
    'TURN_READY',
    'RELATIONSHIP_UPDATE',
    'WORLD_UPDATE',
    'COMMENT',
    'MODERATION'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: PostingOrderMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PostingOrderMode" AS ENUM (
    'FREEFORM',
    'TURN_ORDER'
);


ALTER TYPE public."PostingOrderMode" OWNER TO postgres;

--
-- Name: RelationshipStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RelationshipStatus" AS ENUM (
    'PROPOSED',
    'ACTIVE',
    'ENDED',
    'HIDDEN'
);


ALTER TYPE public."RelationshipStatus" OWNER TO postgres;

--
-- Name: RelationshipType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RelationshipType" AS ENUM (
    'FRIEND',
    'RIVAL',
    'FAMILY',
    'ENEMY',
    'LOVER',
    'ALLY',
    'OTHER'
);


ALTER TYPE public."RelationshipType" OWNER TO postgres;

--
-- Name: ReportReason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportReason" AS ENUM (
    'SPAM',
    'HARASSMENT',
    'HATE',
    'EXPLICIT_CONTENT',
    'VIOLENCE',
    'OTHER'
);


ALTER TYPE public."ReportReason" OWNER TO postgres;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'OPEN',
    'REVIEWING',
    'RESOLVED',
    'DISMISSED'
);


ALTER TYPE public."ReportStatus" OWNER TO postgres;

--
-- Name: SceneParticipantStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SceneParticipantStatus" AS ENUM (
    'INVITED',
    'ACTIVE',
    'LEFT',
    'REMOVED'
);


ALTER TYPE public."SceneParticipantStatus" OWNER TO postgres;

--
-- Name: ScenePostType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ScenePostType" AS ENUM (
    'IN_CHARACTER',
    'OUT_OF_CHARACTER',
    'NARRATION',
    'SYSTEM'
);


ALTER TYPE public."ScenePostType" OWNER TO postgres;

--
-- Name: SceneStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SceneStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'ARCHIVED'
);


ALTER TYPE public."SceneStatus" OWNER TO postgres;

--
-- Name: SessionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SessionStatus" AS ENUM (
    'ACTIVE',
    'REVOKED',
    'EXPIRED'
);


ALTER TYPE public."SessionStatus" OWNER TO postgres;

--
-- Name: StoryArcStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StoryArcStatus" AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'ARCHIVED'
);


ALTER TYPE public."StoryArcStatus" OWNER TO postgres;

--
-- Name: TagType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TagType" AS ENUM (
    'GENERAL',
    'CONTENT_WARNING',
    'GENRE',
    'LOCATION',
    'THEME'
);


ALTER TYPE public."TagType" OWNER TO postgres;

--
-- Name: TargetEntityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TargetEntityType" AS ENUM (
    'WORLD',
    'CHARACTER',
    'SCENE',
    'SCENE_POST',
    'STORY_ARC',
    'LORE_ENTRY',
    'TIMELINE_EVENT',
    'JOURNAL_ENTRY',
    'RELATIONSHIP',
    'WORLD_LOCATION'
);


ALTER TYPE public."TargetEntityType" OWNER TO postgres;

--
-- Name: TelegramImportStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TelegramImportStatus" AS ENUM (
    'UPLOADED',
    'PARSED',
    'MAPPED',
    'IMPORTED',
    'FAILED',
    'ROLLED_BACK'
);


ALTER TYPE public."TelegramImportStatus" OWNER TO postgres;

--
-- Name: TimelineEventType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TimelineEventType" AS ENUM (
    'WORLD',
    'CHARACTER',
    'SCENE',
    'LORE',
    'OTHER'
);


ALTER TYPE public."TimelineEventType" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'DELETED'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

--
-- Name: WorldMemberRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorldMemberRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MODERATOR',
    'WRITER',
    'CONTRIBUTOR',
    'READER'
);


ALTER TYPE public."WorldMemberRole" OWNER TO postgres;

--
-- Name: WorldStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorldStatus" AS ENUM (
    'ACTIVE',
    'ARCHIVED',
    'DELETED'
);


ALTER TYPE public."WorldStatus" OWNER TO postgres;

--
-- Name: WorldVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorldVisibility" AS ENUM (
    'PRIVATE',
    'UNLISTED',
    'PUBLIC',
    'PASSWORD_PROTECTED'
);


ALTER TYPE public."WorldVisibility" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_summaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_summaries (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    requested_by_user_id uuid,
    entity_type public."TargetEntityType" NOT NULL,
    entity_id uuid NOT NULL,
    summary_text text NOT NULL,
    model_name text,
    status public."GeneratedContentStatus" DEFAULT 'COMPLETED'::public."GeneratedContentStatus" NOT NULL,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    generated_at timestamp(3) without time zone
);


ALTER TABLE public.ai_summaries OWNER TO postgres;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id uuid NOT NULL,
    uploaded_by_user_id uuid NOT NULL,
    world_id uuid,
    entity_type public."TargetEntityType" NOT NULL,
    entity_id uuid NOT NULL,
    file_url text NOT NULL,
    mime_type text NOT NULL,
    file_size bigint NOT NULL,
    width integer,
    height integer,
    alt_text text,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    actor_user_id uuid,
    world_id uuid,
    action text NOT NULL,
    entity_type public."TargetEntityType",
    entity_id uuid,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: character_journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.character_journal_entries (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    character_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    visibility public."JournalVisibility" DEFAULT 'PRIVATE'::public."JournalVisibility" NOT NULL,
    occurred_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.character_journal_entries OWNER TO postgres;

--
-- Name: character_memories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.character_memories (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    character_id uuid NOT NULL,
    created_by_user_id uuid,
    source_type public."MemorySourceType" DEFAULT 'MANUAL'::public."MemorySourceType" NOT NULL,
    source_entity_type public."TargetEntityType",
    source_entity_id uuid,
    title text NOT NULL,
    body text NOT NULL,
    visibility public."ContentVisibility" DEFAULT 'PRIVATE'::public."ContentVisibility" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    archived_at timestamp(3) without time zone
);


ALTER TABLE public.character_memories OWNER TO postgres;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.characters (
    id uuid NOT NULL,
    world_id uuid,
    owner_user_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    title text,
    age text,
    avatar_url text,
    appearance text,
    personality text,
    biography text,
    summary text,
    traits_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    status public."CharacterStatus" DEFAULT 'DRAFT'::public."CharacterStatus" NOT NULL,
    visibility public."ContentVisibility" DEFAULT 'WORLD'::public."ContentVisibility" NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    last_active_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.characters OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid NOT NULL,
    world_id uuid,
    user_id uuid NOT NULL,
    entity_type public."TargetEntityType" NOT NULL,
    entity_id uuid NOT NULL,
    body text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: content_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_reports (
    id uuid NOT NULL,
    reporter_user_id uuid NOT NULL,
    resolver_user_id uuid,
    world_id uuid,
    entity_type public."TargetEntityType" NOT NULL,
    entity_id uuid NOT NULL,
    reason public."ReportReason" NOT NULL,
    details text,
    status public."ReportStatus" DEFAULT 'OPEN'::public."ReportStatus" NOT NULL,
    resolution_notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at timestamp(3) without time zone
);


ALTER TABLE public.content_reports OWNER TO postgres;

--
-- Name: event_characters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_characters (
    event_id uuid NOT NULL,
    character_id uuid NOT NULL,
    role text
);


ALTER TABLE public.event_characters OWNER TO postgres;

--
-- Name: generated_artwork; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generated_artwork (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    scene_id uuid,
    character_id uuid,
    created_by_user_id uuid NOT NULL,
    prompt text NOT NULL,
    image_url text,
    status public."GeneratedContentStatus" DEFAULT 'PENDING'::public."GeneratedContentStatus" NOT NULL,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp(3) without time zone
);


ALTER TABLE public.generated_artwork OWNER TO postgres;

--
-- Name: lore_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lore_entries (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    category public."LoreCategory" DEFAULT 'OTHER'::public."LoreCategory" NOT NULL,
    body text NOT NULL,
    visibility public."ContentVisibility" DEFAULT 'WORLD'::public."ContentVisibility" NOT NULL,
    canonical_status public."CanonicalStatus" DEFAULT 'DRAFT'::public."CanonicalStatus" NOT NULL,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.lore_entries OWNER TO postgres;

--
-- Name: map_location_pins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_location_pins (
    id uuid NOT NULL,
    map_id uuid NOT NULL,
    location_id uuid NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    label text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.map_location_pins OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    world_id uuid,
    type public."NotificationType" NOT NULL,
    entity_type public."TargetEntityType",
    entity_id uuid,
    payload_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    read_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    user_id uuid NOT NULL,
    display_name text NOT NULL,
    bio text,
    avatar_url text,
    timezone text,
    content_preferences jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: relationships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationships (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    character_a_id uuid NOT NULL,
    character_b_id uuid NOT NULL,
    updated_by_user_id uuid,
    relationship_type public."RelationshipType" NOT NULL,
    status public."RelationshipStatus" DEFAULT 'ACTIVE'::public."RelationshipStatus" NOT NULL,
    description text,
    notes text,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.relationships OWNER TO postgres;

--
-- Name: scene_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scene_participants (
    id uuid NOT NULL,
    scene_id uuid NOT NULL,
    character_id uuid NOT NULL,
    user_id uuid NOT NULL,
    participant_status public."SceneParticipantStatus" DEFAULT 'ACTIVE'::public."SceneParticipantStatus" NOT NULL,
    turn_order integer,
    last_post_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.scene_participants OWNER TO postgres;

--
-- Name: scene_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scene_posts (
    id uuid NOT NULL,
    scene_id uuid NOT NULL,
    character_id uuid,
    user_id uuid NOT NULL,
    body text NOT NULL,
    post_type public."ScenePostType" DEFAULT 'IN_CHARACTER'::public."ScenePostType" NOT NULL,
    sequence_number integer NOT NULL,
    metadata_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    edited_at timestamp(3) without time zone,
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.scene_posts OWNER TO postgres;

--
-- Name: scenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scenes (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    arc_id uuid,
    location_id uuid,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    summary text,
    location_text text,
    status public."SceneStatus" DEFAULT 'DRAFT'::public."SceneStatus" NOT NULL,
    visibility public."ContentVisibility" DEFAULT 'WORLD'::public."ContentVisibility" NOT NULL,
    posting_order_mode public."PostingOrderMode" DEFAULT 'FREEFORM'::public."PostingOrderMode" NOT NULL,
    started_at timestamp(3) without time zone,
    ended_at timestamp(3) without time zone,
    last_activity_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.scenes OWNER TO postgres;

--
-- Name: story_arcs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.story_arcs (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    summary text,
    status public."StoryArcStatus" DEFAULT 'PLANNED'::public."StoryArcStatus" NOT NULL,
    starts_at timestamp(3) without time zone,
    ends_at timestamp(3) without time zone,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.story_arcs OWNER TO postgres;

--
-- Name: taggings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taggings (
    tag_id uuid NOT NULL,
    entity_type public."TargetEntityType" NOT NULL,
    entity_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.taggings OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    tag_type public."TagType" DEFAULT 'GENERAL'::public."TagType" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: telegram_import_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_import_messages (
    id uuid NOT NULL,
    import_id uuid NOT NULL,
    telegram_message_id text,
    sender_name text NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    sequence_number integer NOT NULL
);


ALTER TABLE public.telegram_import_messages OWNER TO postgres;

--
-- Name: telegram_import_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_import_participants (
    id uuid NOT NULL,
    import_id uuid NOT NULL,
    telegram_name text NOT NULL,
    mapped_character_id uuid
);


ALTER TABLE public.telegram_import_participants OWNER TO postgres;

--
-- Name: telegram_imports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_imports (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    world_id uuid,
    file_name text NOT NULL,
    status public."TelegramImportStatus" DEFAULT 'UPLOADED'::public."TelegramImportStatus" NOT NULL,
    error_message text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_scene_id uuid,
    file_hash text,
    first_message_at timestamp(3) without time zone,
    last_message_at timestamp(3) without time zone,
    message_count integer DEFAULT 0 NOT NULL,
    participant_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.telegram_imports OWNER TO postgres;

--
-- Name: timeline_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timeline_events (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    linked_scene_id uuid,
    linked_lore_entry_id uuid,
    location_id uuid,
    title text NOT NULL,
    description text,
    event_date_text text,
    event_sort_key bigint,
    event_type public."TimelineEventType" DEFAULT 'WORLD'::public."TimelineEventType" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.timeline_events OWNER TO postgres;

--
-- Name: user_blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_blocks (
    blocker_user_id uuid NOT NULL,
    blocked_user_id uuid NOT NULL,
    reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_blocks OWNER TO postgres;

--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_follows (
    follower_user_id uuid NOT NULL,
    following_user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_follows OWNER TO postgres;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    refresh_token_hash text NOT NULL,
    user_agent text,
    ip_address text,
    status public."SessionStatus" DEFAULT 'ACTIVE'::public."SessionStatus" NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    revoked_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    last_login_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    active_character_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: world_follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_follows (
    user_id uuid NOT NULL,
    world_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.world_follows OWNER TO postgres;

--
-- Name: world_invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_invitations (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    invited_by_user_id uuid NOT NULL,
    invited_user_id uuid,
    invited_email text,
    role public."WorldMemberRole" DEFAULT 'READER'::public."WorldMemberRole" NOT NULL,
    token_hash text NOT NULL,
    status public."InvitationStatus" DEFAULT 'PENDING'::public."InvitationStatus" NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    accepted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.world_invitations OWNER TO postgres;

--
-- Name: world_invite_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_invite_links (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    code text NOT NULL,
    role public."WorldMemberRole" DEFAULT 'READER'::public."WorldMemberRole" NOT NULL,
    max_uses integer,
    current_uses integer DEFAULT 0 NOT NULL,
    expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.world_invite_links OWNER TO postgres;

--
-- Name: world_join_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_join_requests (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status public."JoinRequestStatus" DEFAULT 'PENDING'::public."JoinRequestStatus" NOT NULL,
    message text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.world_join_requests OWNER TO postgres;

--
-- Name: world_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_locations (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    parent_location_id uuid,
    created_by_user_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    location_type public."LocationType" DEFAULT 'OTHER'::public."LocationType" NOT NULL,
    visibility public."ContentVisibility" DEFAULT 'WORLD'::public."ContentVisibility" NOT NULL,
    coordinates_json jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.world_locations OWNER TO postgres;

--
-- Name: world_maps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_maps (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    name text NOT NULL,
    image_url text,
    bounds_json jsonb,
    status public."MapStatus" DEFAULT 'DRAFT'::public."MapStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.world_maps OWNER TO postgres;

--
-- Name: world_memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_memberships (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public."WorldMemberRole" DEFAULT 'READER'::public."WorldMemberRole" NOT NULL,
    status public."MembershipStatus" DEFAULT 'ACTIVE'::public."MembershipStatus" NOT NULL,
    joined_at timestamp(3) without time zone,
    last_seen_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.world_memberships OWNER TO postgres;

--
-- Name: world_whitelists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_whitelists (
    id uuid NOT NULL,
    world_id uuid NOT NULL,
    user_id uuid NOT NULL,
    added_by_user_id uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.world_whitelists OWNER TO postgres;

--
-- Name: worlds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.worlds (
    id uuid NOT NULL,
    owner_user_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    rules text,
    visibility public."WorldVisibility" DEFAULT 'PRIVATE'::public."WorldVisibility" NOT NULL,
    status public."WorldStatus" DEFAULT 'ACTIVE'::public."WorldStatus" NOT NULL,
    settings_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    banner_url text,
    character_count integer DEFAULT 0 NOT NULL,
    genre text,
    icon_url text,
    member_count integer DEFAULT 1 NOT NULL,
    scene_count integer DEFAULT 0 NOT NULL,
    summary text,
    tags_array text[] DEFAULT ARRAY[]::text[],
    password_hash text
);


ALTER TABLE public.worlds OWNER TO postgres;

--
-- Data for Name: ai_summaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_summaries (id, world_id, requested_by_user_id, entity_type, entity_id, summary_text, model_name, status, metadata_json, created_at, generated_at) FROM stdin;
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, uploaded_by_user_id, world_id, entity_type, entity_id, file_url, mime_type, file_size, width, height, alt_text, metadata_json, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, actor_user_id, world_id, action, entity_type, entity_id, metadata_json, created_at) FROM stdin;
\.


--
-- Data for Name: character_journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_journal_entries (id, world_id, character_id, created_by_user_id, title, body, visibility, occurred_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: character_memories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_memories (id, world_id, character_id, created_by_user_id, source_type, source_entity_type, source_entity_id, title, body, visibility, created_at, updated_at, archived_at) FROM stdin;
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, world_id, owner_user_id, name, slug, title, age, avatar_url, appearance, personality, biography, summary, traits_json, status, visibility, is_published, is_archived, last_active_at, created_at, updated_at, deleted_at) FROM stdin;
66e186ac-62ec-425d-a708-ef85f57efb07	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Silvar Vold	silvar-vold-ez0e	Duke	Immortal	\N	Physically present	Good	He is history	\N	{}	DRAFT	WORLD	t	f	\N	2026-06-05 08:43:16.541	2026-06-05 08:43:16.541	\N
08dce958-03b4-4da5-9c1f-34fbc61c2456	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Velmora	velmora	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:19:32.77	2026-06-17 19:19:32.77	\N
5747e69b-dc0e-4363-80b2-7f19c2983279	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Fancy QT	fancy-qt	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:19:32.777	2026-06-17 19:19:32.777	\N
8e2f877c-b4be-4864-a034-d1a261faf607	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	2510080006 - Sathya Krishna	2510080006---sathya-krishna	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:19:32.779	2026-06-17 19:19:32.779	\N
29a185d0-e2ee-4752-93b1-fe1cbbc396c2	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Velmora	velmora	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:20:05.459	2026-06-17 19:20:05.459	\N
a8f93241-02d4-4c93-abc5-db906f94f6e6	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Fancy QT	fancy-qt	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:20:05.465	2026-06-17 19:20:05.465	\N
7f090772-c85f-4e09-ab9a-34d05b2bc968	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	2510080006 - Sathya Krishna	2510080006---sathya-krishna	\N	\N	\N	\N	\N	\N	\N	{}	DRAFT	WORLD	f	f	\N	2026-06-17 19:20:05.467	2026-06-17 19:20:05.467	\N
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, world_id, user_id, entity_type, entity_id, body, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: content_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_reports (id, reporter_user_id, resolver_user_id, world_id, entity_type, entity_id, reason, details, status, resolution_notes, created_at, resolved_at) FROM stdin;
\.


--
-- Data for Name: event_characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_characters (event_id, character_id, role) FROM stdin;
\.


--
-- Data for Name: generated_artwork; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generated_artwork (id, world_id, scene_id, character_id, created_by_user_id, prompt, image_url, status, metadata_json, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: lore_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lore_entries (id, world_id, created_by_user_id, title, slug, category, body, visibility, canonical_status, metadata_json, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: map_location_pins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_location_pins (id, map_id, location_id, x, y, label, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, world_id, type, entity_type, entity_id, payload_json, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (user_id, display_name, bio, avatar_url, timezone, content_preferences, created_at, updated_at) FROM stdin;
2f4ca62a-74db-4716-8ee9-0f9add13dd00	AlooMan	\N	\N	\N	{}	2026-06-05 08:36:02.839	2026-06-05 08:36:02.839
\.


--
-- Data for Name: relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationships (id, world_id, character_a_id, character_b_id, updated_by_user_id, relationship_type, status, description, notes, metadata_json, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: scene_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scene_participants (id, scene_id, character_id, user_id, participant_status, turn_order, last_post_at, created_at, updated_at) FROM stdin;
48b5c608-a3ec-43db-ab3c-f81605741eac	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	08dce958-03b4-4da5-9c1f-34fbc61c2456	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:19:32.845	2026-06-17 19:19:32.845
f712bf60-c0bd-468e-b6c4-ac1ced71443a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:19:32.845	2026-06-17 19:19:32.845
714af587-ba32-41de-a9f8-ab5e2ef97060	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:19:32.845	2026-06-17 19:19:32.845
47ac207c-8606-44ed-94ea-a3d1964a8216	46614bf5-21fd-4209-80d4-dedb5212853a	29a185d0-e2ee-4752-93b1-fe1cbbc396c2	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:20:05.53	2026-06-17 19:20:05.53
71e34689-6d80-4b76-a795-facd5162f713	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:20:05.53	2026-06-17 19:20:05.53
a340929f-83ae-44ff-a804-0fa5bf822e23	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	ACTIVE	\N	\N	2026-06-17 19:20:05.53	2026-06-17 19:20:05.53
\.


--
-- Data for Name: scene_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scene_posts (id, scene_id, character_id, user_id, body, post_type, sequence_number, metadata_json, edited_at, deleted_at, created_at, updated_at) FROM stdin;
7db9129f-f683-4c21-ad78-369a04d35304	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	08dce958-03b4-4da5-9c1f-34fbc61c2456	2f4ca62a-74db-4716-8ee9-0f9add13dd00	In a land of wealth, many kingdoms live in peace and have good connections with each other. One of these is Velmora, a kingdom built near the sea Vicona. Famous for throwing parties for all nobles and royalties.	IN_CHARACTER	1	{}	\N	\N	2026-08-03 09:34:31	2026-08-03 09:34:31
551c428c-996e-4854-9c23-34f8daf804a1	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	It was a usual party, standing by a drinks table, a wine coloured drink in hand and watching the room full of royalties and nobles chatting around.Her dress was a deep red colour matching the drink in her hand, soft black hair adorned with a blooming rose.	IN_CHARACTER	2	{}	\N	\N	2026-08-03 09:59:13	2026-08-03 09:59:13
fb5529aa-1484-4c6a-8ff0-6d295225033f	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Standing near the window, where the sea breeze drifts into the room, his eyes calmly scanning the nobles and royalties. His eyes pause when he notices the women by the drinks table holding a drink in her hand.He walks over to the table with composed and dignified steps, stopping beside the table"The room is full of nobles, yet somehow you stand out the most."	IN_CHARACTER	3	{}	\N	\N	2026-08-03 10:09:55	2026-08-03 10:09:55
83b85d1a-2ebc-4c6e-b0fb-b3d987571c4e	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Her gaze doesn’t move away from the crowd not caring for of his presence.“Oh do I now? How so?” Her tone uninterested…	IN_CHARACTER	4	{}	\N	\N	2026-08-03 10:17:47	2026-08-03 10:17:47
0b05c6e7-2475-41fe-83eb-8e7eab269c6b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His expression calm and unbothered, adjusting his dark slightly wavy hair and looking at her with his sharp and observant eyes"In middle of all this crowd and noise, You remain calm and confident. This kind of composure carries a great elegance."	IN_CHARACTER	5	{}	\N	\N	2026-08-03 10:26:38	2026-08-03 10:26:38
821066fd-bca9-4741-8dea-f634c2d263d3	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She closed her eyes in thought, sipping her drink. “Interesting… and who might you be?” She opened her eyes glancing her him with the corner of her eye, her eyes were white, pure white irises.	IN_CHARACTER	6	{}	\N	\N	2026-08-03 10:33:21	2026-08-03 10:33:21
53f3d72b-f33a-478d-b516-b687aafd1cf5	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He is dressed in a tailored dark grey noble coat with silver detailing, worn over a white shirt and a silver brooch with his house crest near the collar along with polished black boots and dark trousers.His posture composed as he looks into her eyes without hesitation."Silvar Vold. Duke and Whom do i have the honor speaking with?"	IN_CHARACTER	7	{}	\N	\N	2026-08-03 10:44:15	2026-08-03 10:44:15
ec6048cb-a117-4cb1-ab85-cfff344cc4b4	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She turns to him, her expression still the same neutral. “Duke Silvar Vold? Not a name I head before… assuming you are not from This kingdom…?”She hold her hand out, expecting a handshake.“I’m Lady Gold.”	IN_CHARACTER	8	{}	\N	\N	2026-08-03 10:51:29	2026-08-03 10:51:29
614de7e3-dd57-4bad-8865-02cc9c863f4e	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He glances over her extended hand before taking it, grips it firm and nods respectfully"Its a pleasure, Lady Gold"He releases his hand, his expressions still calm and curious"Yes you are correct. I am not from this kingdom, but heard about Velmora's Celebrations across many kingdoms"	IN_CHARACTER	9	{}	\N	\N	2026-08-03 10:58:16	2026-08-03 10:58:16
a02003e2-40c7-4075-8f0b-e6d8bf739b1f	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She nods, turning back to the crowd. “Indeed Velmora’s riches allow for parties like these almost every week.”She pauses to take a sip of her drink. “So, where are you from?”	IN_CHARACTER	10	{}	\N	\N	2026-08-03 11:05:34	2026-08-03 11:05:34
eab7b394-4750-4bf3-9c28-2058cc761d4e	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He rests his hand on the table and leans on it, looking at the crowd"From a land not too distant, but much quitter than Velmora"	IN_CHARACTER	11	{}	\N	\N	2026-08-03 11:27:22	2026-08-03 11:27:22
e0eb7aef-cdd4-4bc3-a886-40baf18db04f	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“No too distant and quieter than Velmora… are you from Trevari? The kingdom south of Velmora…?”She looks at him with interest, curious about where he is from.	IN_CHARACTER	12	{}	\N	\N	2026-08-03 11:36:57	2026-08-03 11:36:57
d0ef7e7c-b9df-4cc4-bfbf-9f5069e08d28	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks back at her with a smile "Not Trevari, much Further a quieter place where celebrations are not as grand as Velmora's"	IN_CHARACTER	13	{}	\N	\N	2026-12-03 17:47:21	2026-12-03 17:47:21
a49b9c97-9000-42d0-acba-2c0dd77fc409	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Oh? I’m sure I know every kingdom that touches the ocean…”She thinks for a moment before asking“Unless that is, if where your from does not touch the ocean?”	IN_CHARACTER	14	{}	\N	\N	2026-12-03 17:51:32	2026-12-03 17:51:32
e50da326-623a-41ae-b652-b0c654176180	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"A quieter coastal land far to the west, known for calm waters and privacy rather than grand display"He shifts his eyes to the window with the ocean view	IN_CHARACTER	15	{}	\N	\N	2026-12-03 18:12:03	2026-12-03 18:12:03
cea8eb06-3830-4277-9db5-b4da4cc9fed8	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Interesting, I see you have a way to dodge my question. It’s alright. You don’t have to tell me where you’re from”her eyes close, and she sips her drink	IN_CHARACTER	16	{}	\N	\N	2026-12-03 18:14:23	2026-12-03 18:14:23
ebd2df48-95a8-42cf-81d4-33c0288dfd6b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"I wasn't dodging the question"He pauses for a moment, his tone calms"The land is called Plabora. It rarely sends its nobels to gatherings like this."He looks back at her"So i suppose you haven't heard of it"	IN_CHARACTER	17	{}	\N	\N	2026-12-03 18:20:15	2026-12-03 18:20:15
dcf68354-5252-4dd2-878b-9c63ed02fcfe	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Plabora? Yes I’ve heard of it. I believe that land has the quietest sea next to it?” She looks at him“And the shores are covered in sharp rock”	IN_CHARACTER	18	{}	\N	\N	2026-12-03 18:26:44	2026-12-03 18:26:44
fa7ecaee-c608-4a2b-a8f2-b84abd421fbe	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He is surprised, was clearly not expecting her to know it"You seem to know it better than most. Yes, the sea there is calm most days, the rocks keep the ships away, which is why Plabora has remained quiet"	IN_CHARACTER	19	{}	\N	\N	2026-03-12 18:37:22	2026-03-12 18:37:22
a5670665-b9ea-43b8-af3e-7dba582f2911	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles looking at him “Well I do have a lot of knowledge of the ocean. So yes know everything related.”“I wonder. Why has the Duke of Palbora travelled all the way to Velmora? Can’t be just for the parties.”	IN_CHARACTER	20	{}	\N	\N	2026-03-12 18:39:57	2026-03-12 18:39:57
898baa0d-c56c-4be8-9cb3-fa8bf68634de	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His eyes widen out of amusement"It would be a very long journey for some wine and music""Velmora sits in the heart of the ocean with many sea routes. Kingdoms that control the ocean often make the future for others who depend on it."His eyes meet hers"So thought it will be worthful journey to visit it myself"	IN_CHARACTER	21	{}	\N	\N	2026-03-12 18:46:54	2026-03-12 18:46:54
93ffbad1-21f6-4e1a-95ff-2f5c1d2100ea	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	When there eyes meet her gaze softens “In that case you should be out there” She points at the crowd of royals “You’ll have a better chance of connecting with some very powerful people.”She looks at the crowd.	IN_CHARACTER	22	{}	\N	\N	2026-03-12 18:50:05	2026-03-12 18:50:05
b1658791-e456-4fa3-9fe5-cdc2ebf2c2fe	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks at the crowd she pointed, then back to her"I could join them but i doubt it that i would find a conversation as interesting"	IN_CHARACTER	23	{}	\N	\N	2026-03-20 17:38:40	2026-03-20 17:38:40
6bc0333b-339a-4df0-9d95-40d99fbf42d7	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Maybe… but I’m not some noble or a royal” She looks at him “You can get quite the interesting conversation with me… but you are a duke, and you won’t get any connections from me.”	IN_CHARACTER	24	{}	\N	\N	2026-03-20 17:42:11	2026-03-20 17:42:11
479d4d0e-c8f4-447e-a796-2a13fcb95701	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"I suppose that makes this conversation even more worthwhile"He pauses , He looks at her more interested"I didn't come here for connections, somethings are far more interesting than being influenced"	IN_CHARACTER	25	{}	\N	\N	2026-03-20 17:47:13	2026-03-20 17:47:13
e9098cbc-03fe-4b97-8d54-dfaefa568087	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Oh?” Her eyes sparking curiously“What might that be…?”	IN_CHARACTER	26	{}	\N	\N	2026-03-20 17:49:22	2026-03-20 17:49:22
0d410f64-ba4a-415d-8d9a-8e50db607e7b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His eyes fixed to her with a gentle smile "Some answers can't be put into words perhaps need to be earned"	IN_CHARACTER	27	{}	\N	\N	2026-03-20 17:53:32	2026-03-20 17:53:32
6bee417d-ba84-4253-afcf-b4f7c6d8f41d	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She chuckles “You’re a tough one Duke Silvar. I can’t seem to get a straight answer out of you.”	IN_CHARACTER	28	{}	\N	\N	2026-03-20 17:55:05	2026-03-20 17:55:05
f588a4c2-4621-40dd-9a38-f6b9cf3eb296	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His tone calm and steady"Not a tough one but just selective. I feel some conversations are  worth when not  rushed and taking time to understand some people"	IN_CHARACTER	29	{}	\N	\N	2026-03-20 17:57:47	2026-03-20 17:57:47
6af946d6-4d42-4928-b84f-5ab767debe9a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Interesting”She finished her drink and sets her glass down. Walks away from him towards a balcony overlooking the sea	IN_CHARACTER	30	{}	\N	\N	2026-03-20 18:00:26	2026-03-20 18:00:26
6fb2de8d-df23-421a-a3d7-62eb39a4483c	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He watches as she walks away, follows her slowly and stands behind her at respectful distance"Vicona looks different from here"He looks at her"Lot Quieter"	IN_CHARACTER	31	{}	\N	\N	2026-03-20 18:03:44	2026-03-20 18:03:44
4e592c05-6b76-4b87-9ef7-ef15dbbcd06b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Indeed, the ocean gets quite too at night.” She sits on the railing of the balcony, looking down at how the balcony hangs off over the sea	IN_CHARACTER	32	{}	\N	\N	2026-03-20 18:06:11	2026-03-20 18:06:11
27c5ad7a-c14d-44de-9867-43b33cd0ea0a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He gets closer to the railing, lightly resting his hand on it and looking below"Some moments are better away from crowd"	IN_CHARACTER	33	{}	\N	\N	2026-03-20 18:10:41	2026-03-20 18:10:41
4b1678a8-453d-4149-ba95-0c5fa71e4e1a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“I agree” She looks at him“But Duke Silvar… some moments don’t last forever.”“Hiding behind a wall of uncertainty, just because you don’t want to risk the wrong person won’t lead you anywhere”	IN_CHARACTER	34	{}	\N	\N	2026-03-20 18:13:55	2026-03-20 18:13:55
42711a4a-76b2-4eed-829c-61b02b704e9b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks into her eyesHis tone calm"I don't avoid risk, Lady Gold""I just choose them carefully"	IN_CHARACTER	35	{}	\N	\N	2026-03-20 18:17:12	2026-03-20 18:17:12
77e89c5d-de81-47bf-b962-ae592389381b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles“Well I hope you find what you’re looking for Duke. Let fate decide if we meet again.”Saying that she tips back, falling off the rails backwards. A second later an audible splash… then silence.	IN_CHARACTER	36	{}	\N	\N	2026-03-20 18:20:56	2026-03-20 18:20:56
b881b8dd-d4bf-4e9f-b5df-3ce0fcdeaaca	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks below into the darkness without hesitation dives in.He starts searching through the darkness"Lady Gold!"He Shouting	IN_CHARACTER	37	{}	\N	\N	2026-03-20 18:27:38	2026-03-20 18:27:38
689656ae-baa0-4ab9-b267-04674158fb93	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	But there was no one. Almost as if she disappeared into the water.	IN_CHARACTER	38	{}	\N	\N	2026-03-20 18:28:25	2026-03-20 18:28:25
846f1564-711f-4b3a-82ca-dc1b03e9db55	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	(Time skip to 1 week ish later)	IN_CHARACTER	39	{}	\N	\N	2026-03-20 18:33:39	2026-03-20 18:33:39
d6621ce2-8240-4a89-b54d-e2eb91eb626b	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	A week as gone by since that nightThe celebrations in Velmora continued as always but Duke Silver was no longer seen among nobles and royals.He was by the docks, looking over merchant ships.Silver starts speaking with the traders, he observes the movement of the routes. He notices some routes having more influence.	IN_CHARACTER	40	{}	\N	\N	2026-03-20 19:01:25	2026-03-20 19:01:25
f3e83d4a-453c-42f1-b179-2fe55a287a50	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	One day as usual the docs were busy and one of the merchants was selling these beautiful gems, rich green in colour the merchant sees him looking and tries to sell him one of these green gems	IN_CHARACTER	41	{}	\N	\N	2026-03-20 19:04:23	2026-03-20 19:04:23
b41ae77a-4e60-4c06-904e-62dc7d61a042	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He takes the gem, studying it with interest"Unusual color, not something from these shores"He looks at the merchant"Where did you get it?"	IN_CHARACTER	42	{}	\N	\N	2026-03-20 19:18:00	2026-03-20 19:18:00
2618f1ba-0196-4f48-989d-f5abb1cd7def	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Merchant: from the bottom of the sea. Very rare-He gets cut off by a very familiar voice“Lies. That is a fake gem make with a type of ora coral. Don’t listen to him”	IN_CHARACTER	43	{}	\N	\N	2026-03-20 19:19:49	2026-03-20 19:19:49
26698ff5-ca03-4ad5-a0a6-e311cb0a0251	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He pauses as he hears her voice, he looks at her for a moment his eyes sparked but he maintained his composureHe gives back the gem to merchant"I see... Vicona has more than trade routes"His eyes meet hers"It returns what was thought lost"	IN_CHARACTER	44	{}	\N	\N	2026-03-20 19:27:13	2026-03-20 19:27:13
f6f65358-f9ae-4cee-b369-8cbf3e6faff7	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smile, amused“Brave of you to jump after me into the sea”	IN_CHARACTER	45	{}	\N	\N	2026-03-20 19:28:58	2026-03-20 19:28:58
e7f87274-ba05-465b-8918-655125ea8268	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He holds her, as if he had something to tell that had not been certain before."Brave..."He looks at her closely "You disappeared, and yet you are here as nothing happened"	IN_CHARACTER	46	{}	\N	\N	2026-03-20 19:34:04	2026-03-20 19:34:04
83ffdd57-9b2c-4735-80fb-a5bff54d833a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Your shaken up did you think I dived into my death?” she gently hold him	IN_CHARACTER	47	{}	\N	\N	2026-03-20 19:36:14	2026-03-20 19:36:14
dcb8f39a-1f02-4402-afd3-e520c2623353	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He doesn't pull away as she holds him, his eyes looking into hers"for a moment.. yes""and also i dont chase what isn't worth finding, so you can imagine my curiosity"	IN_CHARACTER	48	{}	\N	\N	2026-03-20 19:41:01	2026-03-20 19:41:01
021681de-1771-4c38-b669-e9e99bc48cf5	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles letting go of him“Well… you have until tonight to fulfill your curiosity before I dive into the sea again…”	IN_CHARACTER	49	{}	\N	\N	2026-03-20 19:42:42	2026-03-20 19:42:42
02a26a1b-a069-49b9-b7da-d07296919285	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He steps closer"I was concerned about the sea but i doubt that now"His eyes on her"Its you"	IN_CHARACTER	50	{}	\N	\N	2026-03-20 19:48:45	2026-03-20 19:48:45
385e0185-762e-48d6-a80f-0b23dbac1b90	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She simply smiles, looking at him	IN_CHARACTER	51	{}	\N	\N	2026-03-20 19:50:17	2026-03-20 19:50:17
ad55a8a0-f4d8-48ce-b8a8-55e4f6355d78	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Indeed… it is me. How? That is for you to figure out”	IN_CHARACTER	52	{}	\N	\N	2026-03-21 17:23:47	2026-03-21 17:23:47
d70aa7a6-ba57-443f-a78c-3dc58e315f90	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"You are not afraid of the sea. and you don't disappear by accident."He is very curious about her"I think, I need to be careful with you Lady Gold? "	IN_CHARACTER	53	{}	\N	\N	2026-03-21 17:45:43	2026-03-21 17:45:43
90cb473f-a63a-4f5b-be0f-d8e9bfe91a74	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Very much so” she chuckled, walking along the dock“So what business do you have here Duke Silvar?”	IN_CHARACTER	54	{}	\N	\N	2026-03-21 17:47:25	2026-03-21 17:47:25
3a620a69-a403-4219-bbc7-e4f94a80c979	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He walking beside her"Trade.. its just the surface"He chuckles"Velmora  has control over the trade routes, the power  it possess on other kingdoms"He looks at her"Perhaps, I think that you might know more about it."	IN_CHARACTER	55	{}	\N	\N	2026-03-21 17:54:53	2026-03-21 17:54:53
6dd4f75a-eef6-4ee0-8a39-f6e32ee5b29c	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“I know a little, would not say I’m a expert”As she looks around she sees a merchant selling these plane looking rocks “Those right there” She take his hand and takes him to that merchant“A tradition in Velmora. You pick out a rock and wish for something you want, then they sand down the rock to reveal your fate”	IN_CHARACTER	56	{}	\N	\N	2026-03-21 18:00:07	2026-03-21 18:00:07
65b51a64-8f99-48eb-9a45-e0e28b9e2117	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	8e2f877c-b4be-4864-a034-d1a261faf607	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He picks  a stone, looking  at it"I'm not sure if I believe in what the stone reveals"He looks at her"But I'm curious  what you wish for."	IN_CHARACTER	57	{}	\N	\N	2026-03-21 18:09:56	2026-03-21 18:09:56
00272ff4-fbe8-4616-aed1-81759ad6304a	1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	5747e69b-dc0e-4363-80b2-7f19c2983279	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Me wish? I don’t do that. I’m more the kind to grant the wishes”She looks at the stone he picked out“Go on make a wish, and give the stone to me”	IN_CHARACTER	58	{}	\N	\N	2026-03-21 18:12:42	2026-03-21 18:12:42
c6968a9c-b3b7-41ca-82c2-ddfd37494700	46614bf5-21fd-4209-80d4-dedb5212853a	29a185d0-e2ee-4752-93b1-fe1cbbc396c2	2f4ca62a-74db-4716-8ee9-0f9add13dd00	In a land of wealth, many kingdoms live in peace and have good connections with each other. One of these is Velmora, a kingdom built near the sea Vicona. Famous for throwing parties for all nobles and royalties.	IN_CHARACTER	1	{}	\N	\N	2026-03-08 09:34:31	2026-03-08 09:34:31
79aaaeb6-57f7-4556-aa3e-69e42f480cf1	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	It was a usual party, standing by a drinks table, a wine coloured drink in hand and watching the room full of royalties and nobles chatting around.Her dress was a deep red colour matching the drink in her hand, soft black hair adorned with a blooming rose.	IN_CHARACTER	2	{}	\N	\N	2026-03-08 09:59:13	2026-03-08 09:59:13
c168cc00-8896-4fb2-b69e-a70fc01c8672	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Standing near the window, where the sea breeze drifts into the room, his eyes calmly scanning the nobles and royalties. His eyes pause when he notices the women by the drinks table holding a drink in her hand.He walks over to the table with composed and dignified steps, stopping beside the table"The room is full of nobles, yet somehow you stand out the most."	IN_CHARACTER	3	{}	\N	\N	2026-03-08 10:09:55	2026-03-08 10:09:55
bcc9b7ff-1919-4a95-96e7-9cd33186073c	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Her gaze doesn’t move away from the crowd not caring for of his presence.“Oh do I now? How so?” Her tone uninterested…	IN_CHARACTER	4	{}	\N	\N	2026-03-08 10:17:47	2026-03-08 10:17:47
20940323-baa1-4cd7-bc6c-2627892401b0	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His expression calm and unbothered, adjusting his dark slightly wavy hair and looking at her with his sharp and observant eyes"In middle of all this crowd and noise, You remain calm and confident. This kind of composure carries a great elegance."	IN_CHARACTER	5	{}	\N	\N	2026-03-08 10:26:38	2026-03-08 10:26:38
e2abcc02-00ab-4d8b-a2c4-ca98c9753a31	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She closed her eyes in thought, sipping her drink. “Interesting… and who might you be?” She opened her eyes glancing her him with the corner of her eye, her eyes were white, pure white irises.	IN_CHARACTER	6	{}	\N	\N	2026-03-08 10:33:21	2026-03-08 10:33:21
79b27f67-d45a-443f-95df-1c4cd69840f0	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He is dressed in a tailored dark grey noble coat with silver detailing, worn over a white shirt and a silver brooch with his house crest near the collar along with polished black boots and dark trousers.His posture composed as he looks into her eyes without hesitation."Silvar Vold. Duke and Whom do i have the honor speaking with?"	IN_CHARACTER	7	{}	\N	\N	2026-03-08 10:44:15	2026-03-08 10:44:15
8f7ac75d-0913-443c-b6e4-ca2286f1bc96	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She turns to him, her expression still the same neutral. “Duke Silvar Vold? Not a name I head before… assuming you are not from This kingdom…?”She hold her hand out, expecting a handshake.“I’m Lady Gold.”	IN_CHARACTER	8	{}	\N	\N	2026-03-08 10:51:29	2026-03-08 10:51:29
ad50cca9-d3e6-46c7-ae01-c084e6831ebc	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He glances over her extended hand before taking it, grips it firm and nods respectfully"Its a pleasure, Lady Gold"He releases his hand, his expressions still calm and curious"Yes you are correct. I am not from this kingdom, but heard about Velmora's Celebrations across many kingdoms"	IN_CHARACTER	9	{}	\N	\N	2026-03-08 10:58:16	2026-03-08 10:58:16
f9e241fd-322b-4e9f-b50e-7069e792a266	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She nods, turning back to the crowd. “Indeed Velmora’s riches allow for parties like these almost every week.”She pauses to take a sip of her drink. “So, where are you from?”	IN_CHARACTER	10	{}	\N	\N	2026-03-08 11:05:34	2026-03-08 11:05:34
99d8aa80-b687-4671-a311-aa044db56385	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He rests his hand on the table and leans on it, looking at the crowd"From a land not too distant, but much quitter than Velmora"	IN_CHARACTER	11	{}	\N	\N	2026-03-08 11:27:22	2026-03-08 11:27:22
00cb5e4b-0e4c-44bf-a0fc-688a6b7448aa	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“No too distant and quieter than Velmora… are you from Trevari? The kingdom south of Velmora…?”She looks at him with interest, curious about where he is from.	IN_CHARACTER	12	{}	\N	\N	2026-03-08 11:36:57	2026-03-08 11:36:57
6a9c0333-6389-49f7-b9e6-35e6f57c0af2	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks back at her with a smile "Not Trevari, much Further a quieter place where celebrations are not as grand as Velmora's"	IN_CHARACTER	13	{}	\N	\N	2026-03-12 17:47:21	2026-03-12 17:47:21
eac4479f-3f2a-4f47-83b4-70d36547fb79	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Oh? I’m sure I know every kingdom that touches the ocean…”She thinks for a moment before asking“Unless that is, if where your from does not touch the ocean?”	IN_CHARACTER	14	{}	\N	\N	2026-03-12 17:51:32	2026-03-12 17:51:32
38128f74-745b-4edc-b9a0-9b795cb5fbfa	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"A quieter coastal land far to the west, known for calm waters and privacy rather than grand display"He shifts his eyes to the window with the ocean view	IN_CHARACTER	15	{}	\N	\N	2026-03-12 18:12:03	2026-03-12 18:12:03
ac845f9e-455a-4c7e-9678-e4a144b4deef	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Interesting, I see you have a way to dodge my question. It’s alright. You don’t have to tell me where you’re from”her eyes close, and she sips her drink	IN_CHARACTER	16	{}	\N	\N	2026-03-12 18:14:23	2026-03-12 18:14:23
87ea0ea1-4427-4a88-b5c9-08d221f14544	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"I wasn't dodging the question"He pauses for a moment, his tone calms"The land is called Plabora. It rarely sends its nobels to gatherings like this."He looks back at her"So i suppose you haven't heard of it"	IN_CHARACTER	17	{}	\N	\N	2026-03-12 18:20:15	2026-03-12 18:20:15
ab80a4f6-f7d4-4169-a61a-65af3df01181	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Plabora? Yes I’ve heard of it. I believe that land has the quietest sea next to it?” She looks at him“And the shores are covered in sharp rock”	IN_CHARACTER	18	{}	\N	\N	2026-03-12 18:26:44	2026-03-12 18:26:44
dec656c1-f8f4-4c54-98a5-5b7dd55f6772	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He is surprised, was clearly not expecting her to know it"You seem to know it better than most. Yes, the sea there is calm most days, the rocks keep the ships away, which is why Plabora has remained quiet"	IN_CHARACTER	19	{}	\N	\N	2026-03-12 18:37:22	2026-03-12 18:37:22
ed479901-c1dd-40f3-85ec-e5d6dd7bebdd	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles looking at him “Well I do have a lot of knowledge of the ocean. So yes know everything related.”“I wonder. Why has the Duke of Palbora travelled all the way to Velmora? Can’t be just for the parties.”	IN_CHARACTER	20	{}	\N	\N	2026-03-12 18:39:57	2026-03-12 18:39:57
a7fc16a9-9a8b-422e-abbf-af802103b474	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His eyes widen out of amusement"It would be a very long journey for some wine and music""Velmora sits in the heart of the ocean with many sea routes. Kingdoms that control the ocean often make the future for others who depend on it."His eyes meet hers"So thought it will be worthful journey to visit it myself"	IN_CHARACTER	21	{}	\N	\N	2026-03-12 18:46:54	2026-03-12 18:46:54
eacd37a6-f681-4b29-8fdc-f2cacef8cfaa	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	When there eyes meet her gaze softens “In that case you should be out there” She points at the crowd of royals “You’ll have a better chance of connecting with some very powerful people.”She looks at the crowd.	IN_CHARACTER	22	{}	\N	\N	2026-03-12 18:50:05	2026-03-12 18:50:05
011bc4ef-946c-41da-b9d1-5d60cc21da21	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks at the crowd she pointed, then back to her"I could join them but i doubt it that i would find a conversation as interesting"	IN_CHARACTER	23	{}	\N	\N	2026-03-20 17:38:40	2026-03-20 17:38:40
4133172b-698e-4506-880a-f85539f13541	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Maybe… but I’m not some noble or a royal” She looks at him “You can get quite the interesting conversation with me… but you are a duke, and you won’t get any connections from me.”	IN_CHARACTER	24	{}	\N	\N	2026-03-20 17:42:11	2026-03-20 17:42:11
3103169b-a682-4d37-b95b-997ae6177677	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"I suppose that makes this conversation even more worthwhile"He pauses , He looks at her more interested"I didn't come here for connections, somethings are far more interesting than being influenced"	IN_CHARACTER	25	{}	\N	\N	2026-03-20 17:47:13	2026-03-20 17:47:13
21f9451c-ba06-4155-869f-3daa028c0c84	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Oh?” Her eyes sparking curiously“What might that be…?”	IN_CHARACTER	26	{}	\N	\N	2026-03-20 17:49:22	2026-03-20 17:49:22
8f22ca6a-a80e-4776-b399-d516ac0f493d	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His eyes fixed to her with a gentle smile "Some answers can't be put into words perhaps need to be earned"	IN_CHARACTER	27	{}	\N	\N	2026-03-20 17:53:32	2026-03-20 17:53:32
183664ab-0f41-49c4-b321-be15be2c9d7d	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She chuckles “You’re a tough one Duke Silvar. I can’t seem to get a straight answer out of you.”	IN_CHARACTER	28	{}	\N	\N	2026-03-20 17:55:05	2026-03-20 17:55:05
1e384acd-8a57-477b-a771-9284f0937672	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	His tone calm and steady"Not a tough one but just selective. I feel some conversations are  worth when not  rushed and taking time to understand some people"	IN_CHARACTER	29	{}	\N	\N	2026-03-20 17:57:47	2026-03-20 17:57:47
a68c0e8c-0d36-4577-a959-67342f297088	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Interesting”She finished her drink and sets her glass down. Walks away from him towards a balcony overlooking the sea	IN_CHARACTER	30	{}	\N	\N	2026-03-20 18:00:26	2026-03-20 18:00:26
80c9f3f4-89bf-4541-b512-980c3468728a	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He watches as she walks away, follows her slowly and stands behind her at respectful distance"Vicona looks different from here"He looks at her"Lot Quieter"	IN_CHARACTER	31	{}	\N	\N	2026-03-20 18:03:44	2026-03-20 18:03:44
7059a896-3e59-4311-adaf-86638b426551	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Indeed, the ocean gets quite too at night.” She sits on the railing of the balcony, looking down at how the balcony hangs off over the sea	IN_CHARACTER	32	{}	\N	\N	2026-03-20 18:06:11	2026-03-20 18:06:11
7aee18b2-b812-47c3-914f-d3837a37817c	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He gets closer to the railing, lightly resting his hand on it and looking below"Some moments are better away from crowd"	IN_CHARACTER	33	{}	\N	\N	2026-03-20 18:10:41	2026-03-20 18:10:41
b1ea3b42-2dff-4d0d-b9fa-17a3fd9ef024	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“I agree” She looks at him“But Duke Silvar… some moments don’t last forever.”“Hiding behind a wall of uncertainty, just because you don’t want to risk the wrong person won’t lead you anywhere”	IN_CHARACTER	34	{}	\N	\N	2026-03-20 18:13:55	2026-03-20 18:13:55
a94935d6-c26b-476b-9232-8129c99ad643	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks into her eyesHis tone calm"I don't avoid risk, Lady Gold""I just choose them carefully"	IN_CHARACTER	35	{}	\N	\N	2026-03-20 18:17:12	2026-03-20 18:17:12
e05951d7-22a4-4511-b76d-2b26e8fa0418	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles“Well I hope you find what you’re looking for Duke. Let fate decide if we meet again.”Saying that she tips back, falling off the rails backwards. A second later an audible splash… then silence.	IN_CHARACTER	36	{}	\N	\N	2026-03-20 18:20:56	2026-03-20 18:20:56
83aaf134-15ce-4813-8161-35e011d3aa04	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He looks below into the darkness without hesitation dives in.He starts searching through the darkness"Lady Gold!"He Shouting	IN_CHARACTER	37	{}	\N	\N	2026-03-20 18:27:38	2026-03-20 18:27:38
f6054a8b-9507-4038-9465-8f7bcd72e5bd	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	But there was no one. Almost as if she disappeared into the water.	IN_CHARACTER	38	{}	\N	\N	2026-03-20 18:28:25	2026-03-20 18:28:25
229075f1-e81f-472c-bcde-7bc4e8ea4dc4	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	(Time skip to 1 week ish later)	IN_CHARACTER	39	{}	\N	\N	2026-03-20 18:33:39	2026-03-20 18:33:39
ff40d4ff-387a-4315-b32a-9206b501c030	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	A week as gone by since that nightThe celebrations in Velmora continued as always but Duke Silver was no longer seen among nobles and royals.He was by the docks, looking over merchant ships.Silver starts speaking with the traders, he observes the movement of the routes. He notices some routes having more influence.	IN_CHARACTER	40	{}	\N	\N	2026-03-20 19:01:25	2026-03-20 19:01:25
f84c5053-968d-479d-be8a-54fff5d73ab6	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	One day as usual the docs were busy and one of the merchants was selling these beautiful gems, rich green in colour the merchant sees him looking and tries to sell him one of these green gems	IN_CHARACTER	41	{}	\N	\N	2026-03-20 19:04:23	2026-03-20 19:04:23
daaa1e0b-54cd-49bd-8026-f25072746502	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He takes the gem, studying it with interest"Unusual color, not something from these shores"He looks at the merchant"Where did you get it?"	IN_CHARACTER	42	{}	\N	\N	2026-03-20 19:18:00	2026-03-20 19:18:00
b93ee4da-ddc1-4021-8128-763d73c35cdc	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Merchant: from the bottom of the sea. Very rare-He gets cut off by a very familiar voice“Lies. That is a fake gem make with a type of ora coral. Don’t listen to him”	IN_CHARACTER	43	{}	\N	\N	2026-03-20 19:19:49	2026-03-20 19:19:49
dac80900-cc45-4d27-8b40-8557dc6dea42	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He pauses as he hears her voice, he looks at her for a moment his eyes sparked but he maintained his composureHe gives back the gem to merchant"I see... Vicona has more than trade routes"His eyes meet hers"It returns what was thought lost"	IN_CHARACTER	44	{}	\N	\N	2026-03-20 19:27:13	2026-03-20 19:27:13
a1c939aa-3cce-4969-adda-6e90204f63ac	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smile, amused“Brave of you to jump after me into the sea”	IN_CHARACTER	45	{}	\N	\N	2026-03-20 19:28:58	2026-03-20 19:28:58
eab351eb-80c2-4996-8682-61e067d32ad0	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He holds her, as if he had something to tell that had not been certain before."Brave..."He looks at her closely "You disappeared, and yet you are here as nothing happened"	IN_CHARACTER	46	{}	\N	\N	2026-03-20 19:34:04	2026-03-20 19:34:04
209215a2-9fb9-4576-ae79-8534f11cd6a0	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Your shaken up did you think I dived into my death?” she gently hold him	IN_CHARACTER	47	{}	\N	\N	2026-03-20 19:36:14	2026-03-20 19:36:14
b9f9c837-55fd-4179-b9a7-a1d449fa2f12	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He doesn't pull away as she holds him, his eyes looking into hers"for a moment.. yes""and also i dont chase what isn't worth finding, so you can imagine my curiosity"	IN_CHARACTER	48	{}	\N	\N	2026-03-20 19:41:01	2026-03-20 19:41:01
94947f97-6ed7-4cef-9d29-3f6412e6d8fe	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She smiles letting go of him“Well… you have until tonight to fulfill your curiosity before I dive into the sea again…”	IN_CHARACTER	49	{}	\N	\N	2026-03-20 19:42:42	2026-03-20 19:42:42
d91411fe-3036-4451-993c-1ee46b1931e2	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He steps closer"I was concerned about the sea but i doubt that now"His eyes on her"Its you"	IN_CHARACTER	50	{}	\N	\N	2026-03-20 19:48:45	2026-03-20 19:48:45
f184d521-feb8-4539-af47-afbbb9b9d7a2	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	She simply smiles, looking at him	IN_CHARACTER	51	{}	\N	\N	2026-03-20 19:50:17	2026-03-20 19:50:17
11a209f1-d4ee-415a-9e90-8b8d6fc864fa	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Indeed… it is me. How? That is for you to figure out”	IN_CHARACTER	52	{}	\N	\N	2026-03-21 17:23:47	2026-03-21 17:23:47
cbc26254-c5b0-42e5-9bbd-287274f2ea4f	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	"You are not afraid of the sea. and you don't disappear by accident."He is very curious about her"I think, I need to be careful with you Lady Gold? "	IN_CHARACTER	53	{}	\N	\N	2026-03-21 17:45:43	2026-03-21 17:45:43
da31ce49-9956-4f88-8c97-c7a81e936d36	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Very much so” she chuckled, walking along the dock“So what business do you have here Duke Silvar?”	IN_CHARACTER	54	{}	\N	\N	2026-03-21 17:47:25	2026-03-21 17:47:25
9df29665-cee2-4bf4-93a6-c6006e7b00a4	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He walking beside her"Trade.. its just the surface"He chuckles"Velmora  has control over the trade routes, the power  it possess on other kingdoms"He looks at her"Perhaps, I think that you might know more about it."	IN_CHARACTER	55	{}	\N	\N	2026-03-21 17:54:53	2026-03-21 17:54:53
c46c220e-d83d-4e62-880b-ac81dafb8877	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“I know a little, would not say I’m a expert”As she looks around she sees a merchant selling these plane looking rocks “Those right there” She take his hand and takes him to that merchant“A tradition in Velmora. You pick out a rock and wish for something you want, then they sand down the rock to reveal your fate”	IN_CHARACTER	56	{}	\N	\N	2026-03-21 18:00:07	2026-03-21 18:00:07
ea4e1fad-75dc-49a2-aea9-e47763af740e	46614bf5-21fd-4209-80d4-dedb5212853a	7f090772-c85f-4e09-ab9a-34d05b2bc968	2f4ca62a-74db-4716-8ee9-0f9add13dd00	He picks  a stone, looking  at it"I'm not sure if I believe in what the stone reveals"He looks at her"But I'm curious  what you wish for."	IN_CHARACTER	57	{}	\N	\N	2026-03-21 18:09:56	2026-03-21 18:09:56
09b19ba0-f9ec-4249-a17e-21927a58a9f5	46614bf5-21fd-4209-80d4-dedb5212853a	a8f93241-02d4-4c93-abc5-db906f94f6e6	2f4ca62a-74db-4716-8ee9-0f9add13dd00	“Me wish? I don’t do that. I’m more the kind to grant the wishes”She looks at the stone he picked out“Go on make a wish, and give the stone to me”	IN_CHARACTER	58	{}	\N	\N	2026-03-21 18:12:42	2026-03-21 18:12:42
\.


--
-- Data for Name: scenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scenes (id, world_id, arc_id, location_id, created_by_user_id, title, summary, location_text, status, visibility, posting_order_mode, started_at, ended_at, last_activity_at, created_at, updated_at, deleted_at) FROM stdin;
1b27d31f-97a7-48ad-a103-0b2d5c4b5a8b	b36814ce-c20e-420d-b625-5c57f0a45353	\N	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Test Imported Scene	Imported from Telegram	\N	COMPLETED	WORLD	FREEFORM	2026-08-03 09:34:31	2026-03-21 18:12:42	2026-06-17 19:19:32.843	2026-06-17 19:19:32.845	2026-06-17 19:19:32.845	\N
46614bf5-21fd-4209-80d4-dedb5212853a	b36814ce-c20e-420d-b625-5c57f0a45353	\N	\N	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Test Imported Scene	Imported from Telegram	\N	COMPLETED	WORLD	FREEFORM	2026-03-08 09:34:31	2026-03-21 18:12:42	2026-06-17 19:20:05.529	2026-06-17 19:20:05.53	2026-06-17 19:20:05.53	\N
\.


--
-- Data for Name: story_arcs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.story_arcs (id, world_id, created_by_user_id, title, summary, status, starts_at, ends_at, sort_order, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: taggings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taggings (tag_id, entity_type, entity_id, created_at) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, world_id, name, slug, tag_type, created_at) FROM stdin;
\.


--
-- Data for Name: telegram_import_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telegram_import_messages (id, import_id, telegram_message_id, sender_name, text, "timestamp", is_system, sequence_number) FROM stdin;
98ac3b8b-2252-4860-80d2-4b161270b03e	2f837919-1102-4c2f-81af-565448d15de3	message2	Velmora	In a land of wealth, many kingdoms live in peace and have good connections with each other. One of these is Velmora, a kingdom built near the sea Vicona. Famous for throwing parties for all nobles and royalties.	2026-08-03 09:34:31	f	1
bc029988-ed7c-4244-b3b3-65743830e5e0	2f837919-1102-4c2f-81af-565448d15de3	message5	Fancy QT	It was a usual party, standing by a drinks table, a wine coloured drink in hand and watching the room full of royalties and nobles chatting around.Her dress was a deep red colour matching the drink in her hand, soft black hair adorned with a blooming rose.	2026-08-03 09:59:13	f	2
415d7f66-f4f3-431d-851b-2607b91660b0	2f837919-1102-4c2f-81af-565448d15de3	message6	2510080006 - Sathya Krishna	Standing near the window, where the sea breeze drifts into the room, his eyes calmly scanning the nobles and royalties. His eyes pause when he notices the women by the drinks table holding a drink in her hand.He walks over to the table with composed and dignified steps, stopping beside the table"The room is full of nobles, yet somehow you stand out the most."	2026-08-03 10:09:55	f	3
00483cdf-5ff5-439f-9baf-f8850a716c19	2f837919-1102-4c2f-81af-565448d15de3	message7	Fancy QT	Her gaze doesn’t move away from the crowd not caring for of his presence.“Oh do I now? How so?” Her tone uninterested…	2026-08-03 10:17:47	f	4
7d397120-a14e-477d-b958-2aeb99d2fae0	2f837919-1102-4c2f-81af-565448d15de3	message8	2510080006 - Sathya Krishna	His expression calm and unbothered, adjusting his dark slightly wavy hair and looking at her with his sharp and observant eyes"In middle of all this crowd and noise, You remain calm and confident. This kind of composure carries a great elegance."	2026-08-03 10:26:38	f	5
3885eee4-b524-4fb9-bb46-56189fe75a7a	2f837919-1102-4c2f-81af-565448d15de3	message9	Fancy QT	She closed her eyes in thought, sipping her drink. “Interesting… and who might you be?” She opened her eyes glancing her him with the corner of her eye, her eyes were white, pure white irises.	2026-08-03 10:33:21	f	6
7a387a85-8893-4387-a1b4-4e4c022b9737	2f837919-1102-4c2f-81af-565448d15de3	message11	2510080006 - Sathya Krishna	He is dressed in a tailored dark grey noble coat with silver detailing, worn over a white shirt and a silver brooch with his house crest near the collar along with polished black boots and dark trousers.His posture composed as he looks into her eyes without hesitation."Silvar Vold. Duke and Whom do i have the honor speaking with?"	2026-08-03 10:44:15	f	7
755cd9d0-f02b-43b4-a5db-9f836eb2786e	2f837919-1102-4c2f-81af-565448d15de3	message12	Fancy QT	She turns to him, her expression still the same neutral. “Duke Silvar Vold? Not a name I head before… assuming you are not from This kingdom…?”She hold her hand out, expecting a handshake.“I’m Lady Gold.”	2026-08-03 10:51:29	f	8
25e46fcc-6f62-49e2-b728-3fa2c46ed604	2f837919-1102-4c2f-81af-565448d15de3	message13	2510080006 - Sathya Krishna	He glances over her extended hand before taking it, grips it firm and nods respectfully"Its a pleasure, Lady Gold"He releases his hand, his expressions still calm and curious"Yes you are correct. I am not from this kingdom, but heard about Velmora's Celebrations across many kingdoms"	2026-08-03 10:58:16	f	9
e3e9235d-5944-4fac-9b86-ef4299fc9e7d	2f837919-1102-4c2f-81af-565448d15de3	message14	Fancy QT	She nods, turning back to the crowd. “Indeed Velmora’s riches allow for parties like these almost every week.”She pauses to take a sip of her drink. “So, where are you from?”	2026-08-03 11:05:34	f	10
a0089e24-eb1d-4376-aef0-9e942249005a	2f837919-1102-4c2f-81af-565448d15de3	message15	2510080006 - Sathya Krishna	He rests his hand on the table and leans on it, looking at the crowd"From a land not too distant, but much quitter than Velmora"	2026-08-03 11:27:22	f	11
d9a7526a-4809-43b3-a7b5-335648efae3a	2f837919-1102-4c2f-81af-565448d15de3	message16	Fancy QT	“No too distant and quieter than Velmora… are you from Trevari? The kingdom south of Velmora…?”She looks at him with interest, curious about where he is from.	2026-08-03 11:36:57	f	12
d1d2ffe0-c1a7-4dce-bf02-1639e74aec3c	2f837919-1102-4c2f-81af-565448d15de3	message17	2510080006 - Sathya Krishna	He looks back at her with a smile "Not Trevari, much Further a quieter place where celebrations are not as grand as Velmora's"	2026-12-03 17:47:21	f	13
d70e5539-745f-4fe1-8980-ad3d13edff1c	2f837919-1102-4c2f-81af-565448d15de3	message18	Fancy QT	“Oh? I’m sure I know every kingdom that touches the ocean…”She thinks for a moment before asking“Unless that is, if where your from does not touch the ocean?”	2026-12-03 17:51:32	f	14
c3877987-7097-4034-863e-28d6a57dc998	2f837919-1102-4c2f-81af-565448d15de3	message19	2510080006 - Sathya Krishna	"A quieter coastal land far to the west, known for calm waters and privacy rather than grand display"He shifts his eyes to the window with the ocean view	2026-12-03 18:12:03	f	15
89a3ac0f-a2b7-4df3-9263-aff0c17db5d2	2f837919-1102-4c2f-81af-565448d15de3	message20	Fancy QT	“Interesting, I see you have a way to dodge my question. It’s alright. You don’t have to tell me where you’re from”her eyes close, and she sips her drink	2026-12-03 18:14:23	f	16
0e57d0cc-02f4-4a8f-921b-67570eb6885f	2f837919-1102-4c2f-81af-565448d15de3	message21	2510080006 - Sathya Krishna	"I wasn't dodging the question"He pauses for a moment, his tone calms"The land is called Plabora. It rarely sends its nobels to gatherings like this."He looks back at her"So i suppose you haven't heard of it"	2026-12-03 18:20:15	f	17
8f068596-c530-4167-8c3b-d830350124f6	2f837919-1102-4c2f-81af-565448d15de3	message22	Fancy QT	“Plabora? Yes I’ve heard of it. I believe that land has the quietest sea next to it?” She looks at him“And the shores are covered in sharp rock”	2026-12-03 18:26:44	f	18
f8e5da3e-2d7d-44a8-b2c6-f0c56feabdd0	2f837919-1102-4c2f-81af-565448d15de3	message23	2510080006 - Sathya Krishna	He is surprised, was clearly not expecting her to know it"You seem to know it better than most. Yes, the sea there is calm most days, the rocks keep the ships away, which is why Plabora has remained quiet"	2026-03-12 18:37:22	f	19
61a65715-a47f-4d25-a881-8f5222377df5	2f837919-1102-4c2f-81af-565448d15de3	message24	Fancy QT	She smiles looking at him “Well I do have a lot of knowledge of the ocean. So yes know everything related.”“I wonder. Why has the Duke of Palbora travelled all the way to Velmora? Can’t be just for the parties.”	2026-03-12 18:39:57	f	20
e43166da-a8fd-4433-96c0-ef7751f28407	2f837919-1102-4c2f-81af-565448d15de3	message25	2510080006 - Sathya Krishna	His eyes widen out of amusement"It would be a very long journey for some wine and music""Velmora sits in the heart of the ocean with many sea routes. Kingdoms that control the ocean often make the future for others who depend on it."His eyes meet hers"So thought it will be worthful journey to visit it myself"	2026-03-12 18:46:54	f	21
6bd85965-9209-40c3-9144-ad7857ff434a	2f837919-1102-4c2f-81af-565448d15de3	message26	Fancy QT	When there eyes meet her gaze softens “In that case you should be out there” She points at the crowd of royals “You’ll have a better chance of connecting with some very powerful people.”She looks at the crowd.	2026-03-12 18:50:05	f	22
855fb571-f030-4023-8e52-8e0a5a4e69ff	2f837919-1102-4c2f-81af-565448d15de3	message27	2510080006 - Sathya Krishna	He looks at the crowd she pointed, then back to her"I could join them but i doubt it that i would find a conversation as interesting"	2026-03-20 17:38:40	f	23
a25d3323-1586-4087-9db7-7d6a45cb7399	2f837919-1102-4c2f-81af-565448d15de3	message28	Fancy QT	“Maybe… but I’m not some noble or a royal” She looks at him “You can get quite the interesting conversation with me… but you are a duke, and you won’t get any connections from me.”	2026-03-20 17:42:11	f	24
9d28833b-feb6-43d2-bbdf-7d5dac3901c2	2f837919-1102-4c2f-81af-565448d15de3	message30	2510080006 - Sathya Krishna	"I suppose that makes this conversation even more worthwhile"He pauses , He looks at her more interested"I didn't come here for connections, somethings are far more interesting than being influenced"	2026-03-20 17:47:13	f	25
bff1607e-b692-446f-b750-dac1777c796e	2f837919-1102-4c2f-81af-565448d15de3	message31	Fancy QT	“Oh?” Her eyes sparking curiously“What might that be…?”	2026-03-20 17:49:22	f	26
58210882-1b4a-4f3b-a7cf-66e635e28295	2f837919-1102-4c2f-81af-565448d15de3	message32	2510080006 - Sathya Krishna	His eyes fixed to her with a gentle smile "Some answers can't be put into words perhaps need to be earned"	2026-03-20 17:53:32	f	27
fc26d787-4e08-4968-b192-4c3df5b75a33	2f837919-1102-4c2f-81af-565448d15de3	message33	Fancy QT	She chuckles “You’re a tough one Duke Silvar. I can’t seem to get a straight answer out of you.”	2026-03-20 17:55:05	f	28
16993d38-653e-4936-811c-86d13d9ae131	2f837919-1102-4c2f-81af-565448d15de3	message34	2510080006 - Sathya Krishna	His tone calm and steady"Not a tough one but just selective. I feel some conversations are  worth when not  rushed and taking time to understand some people"	2026-03-20 17:57:47	f	29
0a9db032-3c1f-43d6-8087-2cfa7c7fadec	2f837919-1102-4c2f-81af-565448d15de3	message35	Fancy QT	“Interesting”She finished her drink and sets her glass down. Walks away from him towards a balcony overlooking the sea	2026-03-20 18:00:26	f	30
b22309d9-75e4-406e-9811-7e97cd3c3550	2f837919-1102-4c2f-81af-565448d15de3	message36	2510080006 - Sathya Krishna	He watches as she walks away, follows her slowly and stands behind her at respectful distance"Vicona looks different from here"He looks at her"Lot Quieter"	2026-03-20 18:03:44	f	31
07aec818-3f3f-489a-8285-ec5d673acd1d	2f837919-1102-4c2f-81af-565448d15de3	message37	Fancy QT	“Indeed, the ocean gets quite too at night.” She sits on the railing of the balcony, looking down at how the balcony hangs off over the sea	2026-03-20 18:06:11	f	32
5e778794-714f-49e9-87d9-f96166d09192	2f837919-1102-4c2f-81af-565448d15de3	message38	2510080006 - Sathya Krishna	He gets closer to the railing, lightly resting his hand on it and looking below"Some moments are better away from crowd"	2026-03-20 18:10:41	f	33
01009ac3-4a4b-4fd2-aef4-8f1631b2f704	2f837919-1102-4c2f-81af-565448d15de3	message39	Fancy QT	“I agree” She looks at him“But Duke Silvar… some moments don’t last forever.”“Hiding behind a wall of uncertainty, just because you don’t want to risk the wrong person won’t lead you anywhere”	2026-03-20 18:13:55	f	34
3fc922b7-46f9-40d6-a913-573e0e1fc4a5	2f837919-1102-4c2f-81af-565448d15de3	message40	2510080006 - Sathya Krishna	He looks into her eyesHis tone calm"I don't avoid risk, Lady Gold""I just choose them carefully"	2026-03-20 18:17:12	f	35
3cc00f3d-b14b-4adb-ba60-8ca990157190	2f837919-1102-4c2f-81af-565448d15de3	message41	Fancy QT	She smiles“Well I hope you find what you’re looking for Duke. Let fate decide if we meet again.”Saying that she tips back, falling off the rails backwards. A second later an audible splash… then silence.	2026-03-20 18:20:56	f	36
043664dc-8f53-4e99-9890-3dd7877212c4	2f837919-1102-4c2f-81af-565448d15de3	message42	2510080006 - Sathya Krishna	He looks below into the darkness without hesitation dives in.He starts searching through the darkness"Lady Gold!"He Shouting	2026-03-20 18:27:38	f	37
0671bfe1-bc92-44c0-8181-49cdcd30df1c	2f837919-1102-4c2f-81af-565448d15de3	message43	Fancy QT	But there was no one. Almost as if she disappeared into the water.	2026-03-20 18:28:25	f	38
1bd4aa32-5beb-4e60-ba01-e3ff43b28363	2f837919-1102-4c2f-81af-565448d15de3	message44	Fancy QT	(Time skip to 1 week ish later)	2026-03-20 18:33:39	f	39
65012023-549f-4554-a88a-6ad5ccc75805	2f837919-1102-4c2f-81af-565448d15de3	message45	2510080006 - Sathya Krishna	A week as gone by since that nightThe celebrations in Velmora continued as always but Duke Silver was no longer seen among nobles and royals.He was by the docks, looking over merchant ships.Silver starts speaking with the traders, he observes the movement of the routes. He notices some routes having more influence.	2026-03-20 19:01:25	f	40
2607666a-6ac3-4bb3-a86c-f9b6bac8ce9d	2f837919-1102-4c2f-81af-565448d15de3	message46	Fancy QT	One day as usual the docs were busy and one of the merchants was selling these beautiful gems, rich green in colour the merchant sees him looking and tries to sell him one of these green gems	2026-03-20 19:04:23	f	41
c6b0c603-36e8-4329-9488-1f237fc6ee8c	2f837919-1102-4c2f-81af-565448d15de3	message47	2510080006 - Sathya Krishna	He takes the gem, studying it with interest"Unusual color, not something from these shores"He looks at the merchant"Where did you get it?"	2026-03-20 19:18:00	f	42
609377cf-eb36-4cae-87ca-a552debd1f85	2f837919-1102-4c2f-81af-565448d15de3	message48	Fancy QT	Merchant: from the bottom of the sea. Very rare-He gets cut off by a very familiar voice“Lies. That is a fake gem make with a type of ora coral. Don’t listen to him”	2026-03-20 19:19:49	f	43
b2378423-1ba8-4377-a8f2-e0480113e412	2f837919-1102-4c2f-81af-565448d15de3	message50	2510080006 - Sathya Krishna	He pauses as he hears her voice, he looks at her for a moment his eyes sparked but he maintained his composureHe gives back the gem to merchant"I see... Vicona has more than trade routes"His eyes meet hers"It returns what was thought lost"	2026-03-20 19:27:13	f	44
616d012c-eac2-487c-9a9b-b6daca1b68c2	2f837919-1102-4c2f-81af-565448d15de3	message51	Fancy QT	She smile, amused“Brave of you to jump after me into the sea”	2026-03-20 19:28:58	f	45
d4046c51-bce7-4d75-a85b-f3db0ba463ac	2f837919-1102-4c2f-81af-565448d15de3	message52	2510080006 - Sathya Krishna	He holds her, as if he had something to tell that had not been certain before."Brave..."He looks at her closely "You disappeared, and yet you are here as nothing happened"	2026-03-20 19:34:04	f	46
6c7ec5e4-f9fd-4c7f-840d-8a20243f213d	2f837919-1102-4c2f-81af-565448d15de3	message53	Fancy QT	“Your shaken up did you think I dived into my death?” she gently hold him	2026-03-20 19:36:14	f	47
5fc7639c-431d-41e7-8989-b146b162e010	2f837919-1102-4c2f-81af-565448d15de3	message54	2510080006 - Sathya Krishna	He doesn't pull away as she holds him, his eyes looking into hers"for a moment.. yes""and also i dont chase what isn't worth finding, so you can imagine my curiosity"	2026-03-20 19:41:01	f	48
122631f0-1e8b-47a9-8ca5-54af5889a9ee	2f837919-1102-4c2f-81af-565448d15de3	message55	Fancy QT	She smiles letting go of him“Well… you have until tonight to fulfill your curiosity before I dive into the sea again…”	2026-03-20 19:42:42	f	49
58e90303-d54d-41e8-bf54-39524117f5ca	2f837919-1102-4c2f-81af-565448d15de3	message56	2510080006 - Sathya Krishna	He steps closer"I was concerned about the sea but i doubt that now"His eyes on her"Its you"	2026-03-20 19:48:45	f	50
cf28eb17-bf51-4e68-841f-16d4d73dc514	2f837919-1102-4c2f-81af-565448d15de3	message57	Fancy QT	She simply smiles, looking at him	2026-03-20 19:50:17	f	51
765c544b-e8ed-423f-9a73-b97acb5d26e7	2f837919-1102-4c2f-81af-565448d15de3	message58	Fancy QT	“Indeed… it is me. How? That is for you to figure out”	2026-03-21 17:23:47	f	52
d25563f3-f999-452c-b40b-e2b5e3e8f75a	2f837919-1102-4c2f-81af-565448d15de3	message59	2510080006 - Sathya Krishna	"You are not afraid of the sea. and you don't disappear by accident."He is very curious about her"I think, I need to be careful with you Lady Gold? "	2026-03-21 17:45:43	f	53
03c3d758-5482-48b4-856f-af7c9adb4a35	2f837919-1102-4c2f-81af-565448d15de3	message60	Fancy QT	“Very much so” she chuckled, walking along the dock“So what business do you have here Duke Silvar?”	2026-03-21 17:47:25	f	54
778c7517-3e93-4298-851a-3296cab59d2c	2f837919-1102-4c2f-81af-565448d15de3	message61	2510080006 - Sathya Krishna	He walking beside her"Trade.. its just the surface"He chuckles"Velmora  has control over the trade routes, the power  it possess on other kingdoms"He looks at her"Perhaps, I think that you might know more about it."	2026-03-21 17:54:53	f	55
b6970d2e-7f62-478a-9295-9fbd01036197	2f837919-1102-4c2f-81af-565448d15de3	message62	Fancy QT	“I know a little, would not say I’m a expert”As she looks around she sees a merchant selling these plane looking rocks “Those right there” She take his hand and takes him to that merchant“A tradition in Velmora. You pick out a rock and wish for something you want, then they sand down the rock to reveal your fate”	2026-03-21 18:00:07	f	56
6d7cee0a-d092-476c-8bbb-c5859f1452d5	2f837919-1102-4c2f-81af-565448d15de3	message63	2510080006 - Sathya Krishna	He picks  a stone, looking  at it"I'm not sure if I believe in what the stone reveals"He looks at her"But I'm curious  what you wish for."	2026-03-21 18:09:56	f	57
89f265de-b0da-4d66-b8ea-976eae7348af	2f837919-1102-4c2f-81af-565448d15de3	message64	Fancy QT	“Me wish? I don’t do that. I’m more the kind to grant the wishes”She looks at the stone he picked out“Go on make a wish, and give the stone to me”	2026-03-21 18:12:42	f	58
aa06940e-2bb6-4c71-bed2-d8360cac016d	d8353eff-c825-4861-b581-5b944b4e06b4	message2	Velmora	In a land of wealth, many kingdoms live in peace and have good connections with each other. One of these is Velmora, a kingdom built near the sea Vicona. Famous for throwing parties for all nobles and royalties.	2026-03-08 09:34:31	f	1
2774a8d2-8780-42f9-9103-054b7b1321a7	d8353eff-c825-4861-b581-5b944b4e06b4	message5	Fancy QT	It was a usual party, standing by a drinks table, a wine coloured drink in hand and watching the room full of royalties and nobles chatting around.Her dress was a deep red colour matching the drink in her hand, soft black hair adorned with a blooming rose.	2026-03-08 09:59:13	f	2
9e282c0e-83a4-486b-ab11-664ad680606d	d8353eff-c825-4861-b581-5b944b4e06b4	message6	2510080006 - Sathya Krishna	Standing near the window, where the sea breeze drifts into the room, his eyes calmly scanning the nobles and royalties. His eyes pause when he notices the women by the drinks table holding a drink in her hand.He walks over to the table with composed and dignified steps, stopping beside the table"The room is full of nobles, yet somehow you stand out the most."	2026-03-08 10:09:55	f	3
54c25a84-0158-4716-9b0f-0d19a937aa4c	d8353eff-c825-4861-b581-5b944b4e06b4	message7	Fancy QT	Her gaze doesn’t move away from the crowd not caring for of his presence.“Oh do I now? How so?” Her tone uninterested…	2026-03-08 10:17:47	f	4
c79ff3e7-e124-4aa1-9003-db2eb1557bfa	d8353eff-c825-4861-b581-5b944b4e06b4	message8	2510080006 - Sathya Krishna	His expression calm and unbothered, adjusting his dark slightly wavy hair and looking at her with his sharp and observant eyes"In middle of all this crowd and noise, You remain calm and confident. This kind of composure carries a great elegance."	2026-03-08 10:26:38	f	5
2fbde90f-40ad-4d19-a5d0-e7f45df38594	d8353eff-c825-4861-b581-5b944b4e06b4	message9	Fancy QT	She closed her eyes in thought, sipping her drink. “Interesting… and who might you be?” She opened her eyes glancing her him with the corner of her eye, her eyes were white, pure white irises.	2026-03-08 10:33:21	f	6
59674def-3c36-4c80-85e9-90c80226d015	d8353eff-c825-4861-b581-5b944b4e06b4	message11	2510080006 - Sathya Krishna	He is dressed in a tailored dark grey noble coat with silver detailing, worn over a white shirt and a silver brooch with his house crest near the collar along with polished black boots and dark trousers.His posture composed as he looks into her eyes without hesitation."Silvar Vold. Duke and Whom do i have the honor speaking with?"	2026-03-08 10:44:15	f	7
e5d1357e-9908-40c1-afd2-1b23a5c0c05d	d8353eff-c825-4861-b581-5b944b4e06b4	message12	Fancy QT	She turns to him, her expression still the same neutral. “Duke Silvar Vold? Not a name I head before… assuming you are not from This kingdom…?”She hold her hand out, expecting a handshake.“I’m Lady Gold.”	2026-03-08 10:51:29	f	8
b13a780c-359e-4f77-8146-698b2d9767c4	d8353eff-c825-4861-b581-5b944b4e06b4	message13	2510080006 - Sathya Krishna	He glances over her extended hand before taking it, grips it firm and nods respectfully"Its a pleasure, Lady Gold"He releases his hand, his expressions still calm and curious"Yes you are correct. I am not from this kingdom, but heard about Velmora's Celebrations across many kingdoms"	2026-03-08 10:58:16	f	9
8fbca69d-6b36-4936-9d30-bac1965e73d9	d8353eff-c825-4861-b581-5b944b4e06b4	message14	Fancy QT	She nods, turning back to the crowd. “Indeed Velmora’s riches allow for parties like these almost every week.”She pauses to take a sip of her drink. “So, where are you from?”	2026-03-08 11:05:34	f	10
61799dc7-3a3b-439e-be32-b1d621237d4e	d8353eff-c825-4861-b581-5b944b4e06b4	message15	2510080006 - Sathya Krishna	He rests his hand on the table and leans on it, looking at the crowd"From a land not too distant, but much quitter than Velmora"	2026-03-08 11:27:22	f	11
f62aab18-4cd0-47ae-9e89-6935243502ed	d8353eff-c825-4861-b581-5b944b4e06b4	message16	Fancy QT	“No too distant and quieter than Velmora… are you from Trevari? The kingdom south of Velmora…?”She looks at him with interest, curious about where he is from.	2026-03-08 11:36:57	f	12
bff4b525-8f53-451b-94d1-5bd1a13f52ce	d8353eff-c825-4861-b581-5b944b4e06b4	message17	2510080006 - Sathya Krishna	He looks back at her with a smile "Not Trevari, much Further a quieter place where celebrations are not as grand as Velmora's"	2026-03-12 17:47:21	f	13
b5b88528-c4c0-4414-8184-e3586ead71c4	d8353eff-c825-4861-b581-5b944b4e06b4	message18	Fancy QT	“Oh? I’m sure I know every kingdom that touches the ocean…”She thinks for a moment before asking“Unless that is, if where your from does not touch the ocean?”	2026-03-12 17:51:32	f	14
5ac64f00-2cf8-4004-b43e-2ffce8bc0fe1	d8353eff-c825-4861-b581-5b944b4e06b4	message19	2510080006 - Sathya Krishna	"A quieter coastal land far to the west, known for calm waters and privacy rather than grand display"He shifts his eyes to the window with the ocean view	2026-03-12 18:12:03	f	15
72a9a3f3-e888-4d9b-9dba-49d91d84f950	d8353eff-c825-4861-b581-5b944b4e06b4	message20	Fancy QT	“Interesting, I see you have a way to dodge my question. It’s alright. You don’t have to tell me where you’re from”her eyes close, and she sips her drink	2026-03-12 18:14:23	f	16
f448ff05-48ed-4fd0-9d03-c8798fc891d8	d8353eff-c825-4861-b581-5b944b4e06b4	message21	2510080006 - Sathya Krishna	"I wasn't dodging the question"He pauses for a moment, his tone calms"The land is called Plabora. It rarely sends its nobels to gatherings like this."He looks back at her"So i suppose you haven't heard of it"	2026-03-12 18:20:15	f	17
dcfe564f-f4be-4938-9577-ed1b3148c0ac	d8353eff-c825-4861-b581-5b944b4e06b4	message22	Fancy QT	“Plabora? Yes I’ve heard of it. I believe that land has the quietest sea next to it?” She looks at him“And the shores are covered in sharp rock”	2026-03-12 18:26:44	f	18
dd5c6155-88a3-4b75-a82e-a60a03f8721f	d8353eff-c825-4861-b581-5b944b4e06b4	message23	2510080006 - Sathya Krishna	He is surprised, was clearly not expecting her to know it"You seem to know it better than most. Yes, the sea there is calm most days, the rocks keep the ships away, which is why Plabora has remained quiet"	2026-03-12 18:37:22	f	19
e2c646e7-6472-4450-9c93-b3f6f30f0d94	d8353eff-c825-4861-b581-5b944b4e06b4	message24	Fancy QT	She smiles looking at him “Well I do have a lot of knowledge of the ocean. So yes know everything related.”“I wonder. Why has the Duke of Palbora travelled all the way to Velmora? Can’t be just for the parties.”	2026-03-12 18:39:57	f	20
7fb44531-6a1f-4de8-a527-11b1aa374c5b	d8353eff-c825-4861-b581-5b944b4e06b4	message25	2510080006 - Sathya Krishna	His eyes widen out of amusement"It would be a very long journey for some wine and music""Velmora sits in the heart of the ocean with many sea routes. Kingdoms that control the ocean often make the future for others who depend on it."His eyes meet hers"So thought it will be worthful journey to visit it myself"	2026-03-12 18:46:54	f	21
54076b28-a95a-4ddd-923b-8571c7e989c3	d8353eff-c825-4861-b581-5b944b4e06b4	message26	Fancy QT	When there eyes meet her gaze softens “In that case you should be out there” She points at the crowd of royals “You’ll have a better chance of connecting with some very powerful people.”She looks at the crowd.	2026-03-12 18:50:05	f	22
98405351-3d99-45e3-b04c-562b1cf95e73	d8353eff-c825-4861-b581-5b944b4e06b4	message27	2510080006 - Sathya Krishna	He looks at the crowd she pointed, then back to her"I could join them but i doubt it that i would find a conversation as interesting"	2026-03-20 17:38:40	f	23
ee2c0ba9-8522-4379-8874-29f6f74c176c	d8353eff-c825-4861-b581-5b944b4e06b4	message28	Fancy QT	“Maybe… but I’m not some noble or a royal” She looks at him “You can get quite the interesting conversation with me… but you are a duke, and you won’t get any connections from me.”	2026-03-20 17:42:11	f	24
3177ad99-305e-4fc4-8676-4ce212f5f2f0	d8353eff-c825-4861-b581-5b944b4e06b4	message30	2510080006 - Sathya Krishna	"I suppose that makes this conversation even more worthwhile"He pauses , He looks at her more interested"I didn't come here for connections, somethings are far more interesting than being influenced"	2026-03-20 17:47:13	f	25
69d99bde-e04b-4d6e-8d74-587bf4bee354	d8353eff-c825-4861-b581-5b944b4e06b4	message31	Fancy QT	“Oh?” Her eyes sparking curiously“What might that be…?”	2026-03-20 17:49:22	f	26
89f23ff8-fa1b-4685-8904-192ec336764c	d8353eff-c825-4861-b581-5b944b4e06b4	message32	2510080006 - Sathya Krishna	His eyes fixed to her with a gentle smile "Some answers can't be put into words perhaps need to be earned"	2026-03-20 17:53:32	f	27
9160fa69-2a2f-45d1-95a7-89a29f8d02fe	d8353eff-c825-4861-b581-5b944b4e06b4	message33	Fancy QT	She chuckles “You’re a tough one Duke Silvar. I can’t seem to get a straight answer out of you.”	2026-03-20 17:55:05	f	28
500000ab-4abe-4fb7-a77e-e5f84c0e491c	d8353eff-c825-4861-b581-5b944b4e06b4	message34	2510080006 - Sathya Krishna	His tone calm and steady"Not a tough one but just selective. I feel some conversations are  worth when not  rushed and taking time to understand some people"	2026-03-20 17:57:47	f	29
ebc2fa08-8689-48ff-b37b-5f7f7a491dd4	d8353eff-c825-4861-b581-5b944b4e06b4	message35	Fancy QT	“Interesting”She finished her drink and sets her glass down. Walks away from him towards a balcony overlooking the sea	2026-03-20 18:00:26	f	30
36d0063f-69be-4698-b938-e70db8540f58	d8353eff-c825-4861-b581-5b944b4e06b4	message36	2510080006 - Sathya Krishna	He watches as she walks away, follows her slowly and stands behind her at respectful distance"Vicona looks different from here"He looks at her"Lot Quieter"	2026-03-20 18:03:44	f	31
ae7a6be4-0cd6-4158-a0a3-e19ca3d3f7b5	d8353eff-c825-4861-b581-5b944b4e06b4	message37	Fancy QT	“Indeed, the ocean gets quite too at night.” She sits on the railing of the balcony, looking down at how the balcony hangs off over the sea	2026-03-20 18:06:11	f	32
f9496d4d-ac0b-4412-8be3-577b93e90714	d8353eff-c825-4861-b581-5b944b4e06b4	message38	2510080006 - Sathya Krishna	He gets closer to the railing, lightly resting his hand on it and looking below"Some moments are better away from crowd"	2026-03-20 18:10:41	f	33
e3e1bba9-0c5f-456f-8817-30b676b38631	d8353eff-c825-4861-b581-5b944b4e06b4	message39	Fancy QT	“I agree” She looks at him“But Duke Silvar… some moments don’t last forever.”“Hiding behind a wall of uncertainty, just because you don’t want to risk the wrong person won’t lead you anywhere”	2026-03-20 18:13:55	f	34
149bbf8d-8a06-42b8-bb87-3f50dd7a803e	d8353eff-c825-4861-b581-5b944b4e06b4	message40	2510080006 - Sathya Krishna	He looks into her eyesHis tone calm"I don't avoid risk, Lady Gold""I just choose them carefully"	2026-03-20 18:17:12	f	35
04bba62b-fb9f-4fe0-a97c-fe1644342cf0	d8353eff-c825-4861-b581-5b944b4e06b4	message41	Fancy QT	She smiles“Well I hope you find what you’re looking for Duke. Let fate decide if we meet again.”Saying that she tips back, falling off the rails backwards. A second later an audible splash… then silence.	2026-03-20 18:20:56	f	36
d1050919-d982-4e09-95e8-1fcef572baef	d8353eff-c825-4861-b581-5b944b4e06b4	message42	2510080006 - Sathya Krishna	He looks below into the darkness without hesitation dives in.He starts searching through the darkness"Lady Gold!"He Shouting	2026-03-20 18:27:38	f	37
fc118ad9-c8e7-442d-bd41-45435394f159	d8353eff-c825-4861-b581-5b944b4e06b4	message43	Fancy QT	But there was no one. Almost as if she disappeared into the water.	2026-03-20 18:28:25	f	38
080f2b0f-f38b-4822-93ef-a68a1a5eb6ad	d8353eff-c825-4861-b581-5b944b4e06b4	message44	Fancy QT	(Time skip to 1 week ish later)	2026-03-20 18:33:39	f	39
a75c4573-36f6-44f2-a7df-cd7f4dc385be	d8353eff-c825-4861-b581-5b944b4e06b4	message45	2510080006 - Sathya Krishna	A week as gone by since that nightThe celebrations in Velmora continued as always but Duke Silver was no longer seen among nobles and royals.He was by the docks, looking over merchant ships.Silver starts speaking with the traders, he observes the movement of the routes. He notices some routes having more influence.	2026-03-20 19:01:25	f	40
7a5f9fe8-4d9c-4929-8a61-8b43ccec5dc9	d8353eff-c825-4861-b581-5b944b4e06b4	message46	Fancy QT	One day as usual the docs were busy and one of the merchants was selling these beautiful gems, rich green in colour the merchant sees him looking and tries to sell him one of these green gems	2026-03-20 19:04:23	f	41
3b23514d-bc22-4f2d-8166-1f4abf8ee7f8	d8353eff-c825-4861-b581-5b944b4e06b4	message47	2510080006 - Sathya Krishna	He takes the gem, studying it with interest"Unusual color, not something from these shores"He looks at the merchant"Where did you get it?"	2026-03-20 19:18:00	f	42
d3eb2132-2c7a-47d5-9dd2-1b97014f99d0	d8353eff-c825-4861-b581-5b944b4e06b4	message48	Fancy QT	Merchant: from the bottom of the sea. Very rare-He gets cut off by a very familiar voice“Lies. That is a fake gem make with a type of ora coral. Don’t listen to him”	2026-03-20 19:19:49	f	43
a787dbdf-bbeb-4960-b2eb-77fdb5c7649f	d8353eff-c825-4861-b581-5b944b4e06b4	message50	2510080006 - Sathya Krishna	He pauses as he hears her voice, he looks at her for a moment his eyes sparked but he maintained his composureHe gives back the gem to merchant"I see... Vicona has more than trade routes"His eyes meet hers"It returns what was thought lost"	2026-03-20 19:27:13	f	44
2d1984bb-2a23-4d63-b826-40f99e00d3b2	d8353eff-c825-4861-b581-5b944b4e06b4	message51	Fancy QT	She smile, amused“Brave of you to jump after me into the sea”	2026-03-20 19:28:58	f	45
f501c32f-81d2-480c-afd7-86ea3c499797	d8353eff-c825-4861-b581-5b944b4e06b4	message52	2510080006 - Sathya Krishna	He holds her, as if he had something to tell that had not been certain before."Brave..."He looks at her closely "You disappeared, and yet you are here as nothing happened"	2026-03-20 19:34:04	f	46
bee1a1d8-96ac-4ecf-a5ff-2d8713297494	d8353eff-c825-4861-b581-5b944b4e06b4	message53	Fancy QT	“Your shaken up did you think I dived into my death?” she gently hold him	2026-03-20 19:36:14	f	47
e17513f8-34a3-4efa-b7bc-e432337bfe4c	d8353eff-c825-4861-b581-5b944b4e06b4	message54	2510080006 - Sathya Krishna	He doesn't pull away as she holds him, his eyes looking into hers"for a moment.. yes""and also i dont chase what isn't worth finding, so you can imagine my curiosity"	2026-03-20 19:41:01	f	48
1ba605c7-2afb-4f02-8c4d-212c9914420c	d8353eff-c825-4861-b581-5b944b4e06b4	message55	Fancy QT	She smiles letting go of him“Well… you have until tonight to fulfill your curiosity before I dive into the sea again…”	2026-03-20 19:42:42	f	49
54610011-608a-4d1d-a8dc-61c91ea73467	d8353eff-c825-4861-b581-5b944b4e06b4	message56	2510080006 - Sathya Krishna	He steps closer"I was concerned about the sea but i doubt that now"His eyes on her"Its you"	2026-03-20 19:48:45	f	50
d2972768-9b52-4fa0-b3e8-e9d7bb961560	d8353eff-c825-4861-b581-5b944b4e06b4	message57	Fancy QT	She simply smiles, looking at him	2026-03-20 19:50:17	f	51
e56fc40c-682c-4905-a4c2-8eec5fe59d33	d8353eff-c825-4861-b581-5b944b4e06b4	message58	Fancy QT	“Indeed… it is me. How? That is for you to figure out”	2026-03-21 17:23:47	f	52
f2f458b9-fb05-4e63-8c4f-af02a3e59fc7	d8353eff-c825-4861-b581-5b944b4e06b4	message59	2510080006 - Sathya Krishna	"You are not afraid of the sea. and you don't disappear by accident."He is very curious about her"I think, I need to be careful with you Lady Gold? "	2026-03-21 17:45:43	f	53
74d53f67-c29e-4d6b-bf89-bc2378d30bda	d8353eff-c825-4861-b581-5b944b4e06b4	message60	Fancy QT	“Very much so” she chuckled, walking along the dock“So what business do you have here Duke Silvar?”	2026-03-21 17:47:25	f	54
4eebb6a7-0a96-4808-834a-101743edc86e	d8353eff-c825-4861-b581-5b944b4e06b4	message61	2510080006 - Sathya Krishna	He walking beside her"Trade.. its just the surface"He chuckles"Velmora  has control over the trade routes, the power  it possess on other kingdoms"He looks at her"Perhaps, I think that you might know more about it."	2026-03-21 17:54:53	f	55
b4b38fca-82e5-4ca9-a2f7-cf39390484c9	d8353eff-c825-4861-b581-5b944b4e06b4	message62	Fancy QT	“I know a little, would not say I’m a expert”As she looks around she sees a merchant selling these plane looking rocks “Those right there” She take his hand and takes him to that merchant“A tradition in Velmora. You pick out a rock and wish for something you want, then they sand down the rock to reveal your fate”	2026-03-21 18:00:07	f	56
1e3b40f5-0d58-4c54-b30c-69e42d6b2126	d8353eff-c825-4861-b581-5b944b4e06b4	message63	2510080006 - Sathya Krishna	He picks  a stone, looking  at it"I'm not sure if I believe in what the stone reveals"He looks at her"But I'm curious  what you wish for."	2026-03-21 18:09:56	f	57
4cbbddd3-81f6-4ed5-808d-db4a9884233f	d8353eff-c825-4861-b581-5b944b4e06b4	message64	Fancy QT	“Me wish? I don’t do that. I’m more the kind to grant the wishes”She looks at the stone he picked out“Go on make a wish, and give the stone to me”	2026-03-21 18:12:42	f	58
\.


--
-- Data for Name: telegram_import_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telegram_import_participants (id, import_id, telegram_name, mapped_character_id) FROM stdin;
8dffec6c-85fe-4e63-ae9a-9f9173bc221a	2f837919-1102-4c2f-81af-565448d15de3	Velmora	\N
c3eb94c3-1312-44fd-beeb-a50bc70c2a85	2f837919-1102-4c2f-81af-565448d15de3	Fancy QT	\N
be54302c-2cd8-485c-b051-0b6bed2768b9	2f837919-1102-4c2f-81af-565448d15de3	2510080006 - Sathya Krishna	\N
9b3f83df-babe-4b8a-b31f-01c54b508f5a	d8353eff-c825-4861-b581-5b944b4e06b4	Velmora	\N
df53cffc-8c3c-4660-8914-186de1cc2d0f	d8353eff-c825-4861-b581-5b944b4e06b4	Fancy QT	\N
915a8eb6-97e6-4d99-a5b3-56e4708a8018	d8353eff-c825-4861-b581-5b944b4e06b4	2510080006 - Sathya Krishna	\N
\.


--
-- Data for Name: telegram_imports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telegram_imports (id, user_id, world_id, file_name, status, error_message, created_at, updated_at, created_scene_id, file_hash, first_message_at, last_message_at, message_count, participant_count) FROM stdin;
2f837919-1102-4c2f-81af-565448d15de3	2f4ca62a-74db-4716-8ee9-0f9add13dd00	b36814ce-c20e-420d-b625-5c57f0a45353	messages.html	PARSED	\N	2026-06-17 19:19:32.784	2026-06-17 19:19:32.784	\N	\N	\N	\N	0	0
d8353eff-c825-4861-b581-5b944b4e06b4	2f4ca62a-74db-4716-8ee9-0f9add13dd00	b36814ce-c20e-420d-b625-5c57f0a45353	messages.html	PARSED	\N	2026-06-17 19:20:05.471	2026-06-17 19:20:05.471	\N	\N	\N	\N	0	0
\.


--
-- Data for Name: timeline_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timeline_events (id, world_id, created_by_user_id, linked_scene_id, linked_lore_entry_id, location_id, title, description, event_date_text, event_sort_key, event_type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_blocks (blocker_user_id, blocked_user_id, reason, created_at) FROM stdin;
\.


--
-- Data for Name: user_follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_follows (follower_user_id, following_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (id, user_id, refresh_token_hash, user_agent, ip_address, status, expires_at, revoked_at, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password_hash, status, last_login_at, created_at, updated_at, deleted_at, active_character_id) FROM stdin;
2f4ca62a-74db-4716-8ee9-0f9add13dd00	luckyindian994@gmail.com	AlooMan	$2b$10$x4Ps57TSxiYNT155SiovgeueSEIEO/.XWTcPJNEIno4FoIZwlSfEW	ACTIVE	\N	2026-06-05 08:36:02.839	2026-06-05 08:43:23.886	\N	66e186ac-62ec-425d-a708-ef85f57efb07
adae3f4d-12b8-44fb-9b32-23784a9f3558	backuptest@example.com	BackupTestUser123	dummy	ACTIVE	\N	2026-06-17 20:09:35.994	2026-06-17 20:09:35.994	\N	\N
\.


--
-- Data for Name: world_follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_follows (user_id, world_id, created_at) FROM stdin;
\.


--
-- Data for Name: world_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_invitations (id, world_id, invited_by_user_id, invited_user_id, invited_email, role, token_hash, status, expires_at, accepted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: world_invite_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_invite_links (id, world_id, created_by_user_id, code, role, max_uses, current_uses, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: world_join_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_join_requests (id, world_id, user_id, status, message, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: world_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_locations (id, world_id, parent_location_id, created_by_user_id, name, slug, description, location_type, visibility, coordinates_json, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: world_maps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_maps (id, world_id, name, image_url, bounds_json, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: world_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_memberships (id, world_id, user_id, role, status, joined_at, last_seen_at, created_at, updated_at) FROM stdin;
9f9afc80-c963-42e3-8195-6639e42f57d7	ad53b251-a03f-4011-96c6-6536fd47eb15	2f4ca62a-74db-4716-8ee9-0f9add13dd00	OWNER	ACTIVE	\N	\N	2026-06-05 08:53:13.177	2026-06-05 08:53:13.177
\.


--
-- Data for Name: world_whitelists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.world_whitelists (id, world_id, user_id, added_by_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: worlds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.worlds (id, owner_user_id, name, slug, description, rules, visibility, status, settings_json, created_at, updated_at, deleted_at, banner_url, character_count, genre, icon_url, member_count, scene_count, summary, tags_array, password_hash) FROM stdin;
ad53b251-a03f-4011-96c6-6536fd47eb15	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Velmora	velmora-9yji	Sea is the Way	\N	PUBLIC	ACTIVE	{}	2026-06-05 08:53:13.177	2026-06-05 08:53:13.177	\N	\N	0	Fantasy	\N	1	0	In the Sea	{}	\N
b36814ce-c20e-420d-b625-5c57f0a45353	2f4ca62a-74db-4716-8ee9-0f9add13dd00	Import Test World	import-test-world	\N	\N	PRIVATE	ACTIVE	{}	2026-06-17 19:18:56.381	2026-06-17 19:18:56.381	\N	\N	0	\N	\N	1	0	\N	{}	\N
\.


--
-- Name: ai_summaries ai_summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_summaries
    ADD CONSTRAINT ai_summaries_pkey PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: character_journal_entries character_journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_journal_entries
    ADD CONSTRAINT character_journal_entries_pkey PRIMARY KEY (id);


--
-- Name: character_memories character_memories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_memories
    ADD CONSTRAINT character_memories_pkey PRIMARY KEY (id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: content_reports content_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_pkey PRIMARY KEY (id);


--
-- Name: event_characters event_characters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_characters
    ADD CONSTRAINT event_characters_pkey PRIMARY KEY (event_id, character_id);


--
-- Name: generated_artwork generated_artwork_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_artwork
    ADD CONSTRAINT generated_artwork_pkey PRIMARY KEY (id);


--
-- Name: lore_entries lore_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lore_entries
    ADD CONSTRAINT lore_entries_pkey PRIMARY KEY (id);


--
-- Name: map_location_pins map_location_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location_pins
    ADD CONSTRAINT map_location_pins_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);


--
-- Name: relationships relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_pkey PRIMARY KEY (id);


--
-- Name: scene_participants scene_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_participants
    ADD CONSTRAINT scene_participants_pkey PRIMARY KEY (id);


--
-- Name: scene_posts scene_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_posts
    ADD CONSTRAINT scene_posts_pkey PRIMARY KEY (id);


--
-- Name: scenes scenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_pkey PRIMARY KEY (id);


--
-- Name: story_arcs story_arcs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_arcs
    ADD CONSTRAINT story_arcs_pkey PRIMARY KEY (id);


--
-- Name: taggings taggings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT taggings_pkey PRIMARY KEY (tag_id, entity_type, entity_id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: telegram_import_messages telegram_import_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_import_messages
    ADD CONSTRAINT telegram_import_messages_pkey PRIMARY KEY (id);


--
-- Name: telegram_import_participants telegram_import_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_import_participants
    ADD CONSTRAINT telegram_import_participants_pkey PRIMARY KEY (id);


--
-- Name: telegram_imports telegram_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_imports
    ADD CONSTRAINT telegram_imports_pkey PRIMARY KEY (id);


--
-- Name: timeline_events timeline_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_pkey PRIMARY KEY (id);


--
-- Name: user_blocks user_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_pkey PRIMARY KEY (blocker_user_id, blocked_user_id);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (follower_user_id, following_user_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: world_follows world_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_follows
    ADD CONSTRAINT world_follows_pkey PRIMARY KEY (user_id, world_id);


--
-- Name: world_invitations world_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invitations
    ADD CONSTRAINT world_invitations_pkey PRIMARY KEY (id);


--
-- Name: world_invite_links world_invite_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invite_links
    ADD CONSTRAINT world_invite_links_pkey PRIMARY KEY (id);


--
-- Name: world_join_requests world_join_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_join_requests
    ADD CONSTRAINT world_join_requests_pkey PRIMARY KEY (id);


--
-- Name: world_locations world_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_locations
    ADD CONSTRAINT world_locations_pkey PRIMARY KEY (id);


--
-- Name: world_maps world_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_maps
    ADD CONSTRAINT world_maps_pkey PRIMARY KEY (id);


--
-- Name: world_memberships world_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_memberships
    ADD CONSTRAINT world_memberships_pkey PRIMARY KEY (id);


--
-- Name: world_whitelists world_whitelists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_whitelists
    ADD CONSTRAINT world_whitelists_pkey PRIMARY KEY (id);


--
-- Name: worlds worlds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worlds
    ADD CONSTRAINT worlds_pkey PRIMARY KEY (id);


--
-- Name: ai_summaries_requested_by_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ai_summaries_requested_by_user_id_idx ON public.ai_summaries USING btree (requested_by_user_id);


--
-- Name: ai_summaries_world_id_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ai_summaries_world_id_entity_type_entity_id_idx ON public.ai_summaries USING btree (world_id, entity_type, entity_id);


--
-- Name: attachments_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attachments_entity_type_entity_id_idx ON public.attachments USING btree (entity_type, entity_id);


--
-- Name: attachments_uploaded_by_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attachments_uploaded_by_user_id_idx ON public.attachments USING btree (uploaded_by_user_id);


--
-- Name: attachments_world_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX attachments_world_id_idx ON public.attachments USING btree (world_id);


--
-- Name: audit_logs_actor_user_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_actor_user_id_created_at_idx ON public.audit_logs USING btree (actor_user_id, created_at);


--
-- Name: audit_logs_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_entity_type_entity_id_idx ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: audit_logs_world_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_world_id_created_at_idx ON public.audit_logs USING btree (world_id, created_at);


--
-- Name: character_journal_entries_character_id_occurred_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_journal_entries_character_id_occurred_at_idx ON public.character_journal_entries USING btree (character_id, occurred_at);


--
-- Name: character_journal_entries_created_by_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_journal_entries_created_by_user_id_idx ON public.character_journal_entries USING btree (created_by_user_id);


--
-- Name: character_journal_entries_world_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_journal_entries_world_id_created_at_idx ON public.character_journal_entries USING btree (world_id, created_at);


--
-- Name: character_memories_character_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_memories_character_id_created_at_idx ON public.character_memories USING btree (character_id, created_at);


--
-- Name: character_memories_source_entity_type_source_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_memories_source_entity_type_source_entity_id_idx ON public.character_memories USING btree (source_entity_type, source_entity_id);


--
-- Name: character_memories_world_id_character_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX character_memories_world_id_character_id_idx ON public.character_memories USING btree (world_id, character_id);


--
-- Name: characters_owner_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX characters_owner_user_id_idx ON public.characters USING btree (owner_user_id);


--
-- Name: characters_world_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX characters_world_id_slug_key ON public.characters USING btree (world_id, slug);


--
-- Name: characters_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX characters_world_id_status_idx ON public.characters USING btree (world_id, status);


--
-- Name: characters_world_id_visibility_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX characters_world_id_visibility_idx ON public.characters USING btree (world_id, visibility);


--
-- Name: comments_entity_type_entity_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_entity_type_entity_id_created_at_idx ON public.comments USING btree (entity_type, entity_id, created_at);


--
-- Name: comments_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_user_id_idx ON public.comments USING btree (user_id);


--
-- Name: comments_world_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_world_id_idx ON public.comments USING btree (world_id);


--
-- Name: content_reports_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX content_reports_entity_type_entity_id_idx ON public.content_reports USING btree (entity_type, entity_id);


--
-- Name: content_reports_reporter_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX content_reports_reporter_user_id_idx ON public.content_reports USING btree (reporter_user_id);


--
-- Name: content_reports_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX content_reports_world_id_status_idx ON public.content_reports USING btree (world_id, status);


--
-- Name: event_characters_character_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX event_characters_character_id_idx ON public.event_characters USING btree (character_id);


--
-- Name: generated_artwork_character_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX generated_artwork_character_id_idx ON public.generated_artwork USING btree (character_id);


--
-- Name: generated_artwork_created_by_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX generated_artwork_created_by_user_id_idx ON public.generated_artwork USING btree (created_by_user_id);


--
-- Name: generated_artwork_scene_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX generated_artwork_scene_id_idx ON public.generated_artwork USING btree (scene_id);


--
-- Name: generated_artwork_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX generated_artwork_world_id_status_idx ON public.generated_artwork USING btree (world_id, status);


--
-- Name: lore_entries_visibility_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lore_entries_visibility_idx ON public.lore_entries USING btree (visibility);


--
-- Name: lore_entries_world_id_canonical_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lore_entries_world_id_canonical_status_idx ON public.lore_entries USING btree (world_id, canonical_status);


--
-- Name: lore_entries_world_id_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lore_entries_world_id_category_idx ON public.lore_entries USING btree (world_id, category);


--
-- Name: lore_entries_world_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX lore_entries_world_id_slug_key ON public.lore_entries USING btree (world_id, slug);


--
-- Name: map_location_pins_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX map_location_pins_location_id_idx ON public.map_location_pins USING btree (location_id);


--
-- Name: map_location_pins_map_id_location_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX map_location_pins_map_id_location_id_key ON public.map_location_pins USING btree (map_id, location_id);


--
-- Name: notifications_user_id_read_at_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_user_id_read_at_created_at_idx ON public.notifications USING btree (user_id, read_at, created_at);


--
-- Name: notifications_world_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_world_id_created_at_idx ON public.notifications USING btree (world_id, created_at);


--
-- Name: profiles_display_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX profiles_display_name_idx ON public.profiles USING btree (display_name);


--
-- Name: relationships_character_a_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX relationships_character_a_id_idx ON public.relationships USING btree (character_a_id);


--
-- Name: relationships_character_b_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX relationships_character_b_id_idx ON public.relationships USING btree (character_b_id);


--
-- Name: relationships_world_id_character_a_id_character_b_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX relationships_world_id_character_a_id_character_b_id_key ON public.relationships USING btree (world_id, character_a_id, character_b_id);


--
-- Name: relationships_world_id_relationship_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX relationships_world_id_relationship_type_idx ON public.relationships USING btree (world_id, relationship_type);


--
-- Name: relationships_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX relationships_world_id_status_idx ON public.relationships USING btree (world_id, status);


--
-- Name: scene_participants_character_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_participants_character_id_idx ON public.scene_participants USING btree (character_id);


--
-- Name: scene_participants_scene_id_character_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX scene_participants_scene_id_character_id_key ON public.scene_participants USING btree (scene_id, character_id);


--
-- Name: scene_participants_scene_id_turn_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_participants_scene_id_turn_order_idx ON public.scene_participants USING btree (scene_id, turn_order);


--
-- Name: scene_participants_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_participants_user_id_idx ON public.scene_participants USING btree (user_id);


--
-- Name: scene_posts_character_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_posts_character_id_idx ON public.scene_posts USING btree (character_id);


--
-- Name: scene_posts_scene_id_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_posts_scene_id_created_at_idx ON public.scene_posts USING btree (scene_id, created_at);


--
-- Name: scene_posts_scene_id_sequence_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX scene_posts_scene_id_sequence_number_key ON public.scene_posts USING btree (scene_id, sequence_number);


--
-- Name: scene_posts_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scene_posts_user_id_idx ON public.scene_posts USING btree (user_id);


--
-- Name: scenes_arc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scenes_arc_id_idx ON public.scenes USING btree (arc_id);


--
-- Name: scenes_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scenes_location_id_idx ON public.scenes USING btree (location_id);


--
-- Name: scenes_visibility_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scenes_visibility_idx ON public.scenes USING btree (visibility);


--
-- Name: scenes_world_id_last_activity_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scenes_world_id_last_activity_at_idx ON public.scenes USING btree (world_id, last_activity_at);


--
-- Name: scenes_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX scenes_world_id_status_idx ON public.scenes USING btree (world_id, status);


--
-- Name: story_arcs_world_id_sort_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX story_arcs_world_id_sort_order_idx ON public.story_arcs USING btree (world_id, sort_order);


--
-- Name: story_arcs_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX story_arcs_world_id_status_idx ON public.story_arcs USING btree (world_id, status);


--
-- Name: taggings_entity_type_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX taggings_entity_type_entity_id_idx ON public.taggings USING btree (entity_type, entity_id);


--
-- Name: tags_world_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tags_world_id_slug_key ON public.tags USING btree (world_id, slug);


--
-- Name: tags_world_id_tag_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tags_world_id_tag_type_idx ON public.tags USING btree (world_id, tag_type);


--
-- Name: telegram_import_messages_import_id_sequence_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX telegram_import_messages_import_id_sequence_number_idx ON public.telegram_import_messages USING btree (import_id, sequence_number);


--
-- Name: telegram_import_participants_import_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX telegram_import_participants_import_id_idx ON public.telegram_import_participants USING btree (import_id);


--
-- Name: telegram_import_participants_import_id_telegram_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX telegram_import_participants_import_id_telegram_name_key ON public.telegram_import_participants USING btree (import_id, telegram_name);


--
-- Name: telegram_imports_file_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX telegram_imports_file_hash_key ON public.telegram_imports USING btree (file_hash);


--
-- Name: telegram_imports_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX telegram_imports_status_idx ON public.telegram_imports USING btree (status);


--
-- Name: telegram_imports_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX telegram_imports_user_id_idx ON public.telegram_imports USING btree (user_id);


--
-- Name: telegram_imports_world_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX telegram_imports_world_id_idx ON public.telegram_imports USING btree (world_id);


--
-- Name: timeline_events_linked_lore_entry_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX timeline_events_linked_lore_entry_id_idx ON public.timeline_events USING btree (linked_lore_entry_id);


--
-- Name: timeline_events_linked_scene_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX timeline_events_linked_scene_id_idx ON public.timeline_events USING btree (linked_scene_id);


--
-- Name: timeline_events_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX timeline_events_location_id_idx ON public.timeline_events USING btree (location_id);


--
-- Name: timeline_events_world_id_event_sort_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX timeline_events_world_id_event_sort_key_idx ON public.timeline_events USING btree (world_id, event_sort_key);


--
-- Name: user_blocks_blocked_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_blocks_blocked_user_id_idx ON public.user_blocks USING btree (blocked_user_id);


--
-- Name: user_follows_following_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_follows_following_user_id_idx ON public.user_follows USING btree (following_user_id);


--
-- Name: user_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_sessions_expires_at_idx ON public.user_sessions USING btree (expires_at);


--
-- Name: user_sessions_refresh_token_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_sessions_refresh_token_hash_key ON public.user_sessions USING btree (refresh_token_hash);


--
-- Name: user_sessions_user_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_sessions_user_id_status_idx ON public.user_sessions USING btree (user_id, status);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_status_idx ON public.users USING btree (status);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: world_follows_world_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_follows_world_id_idx ON public.world_follows USING btree (world_id);


--
-- Name: world_invitations_invited_email_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_invitations_invited_email_status_idx ON public.world_invitations USING btree (invited_email, status);


--
-- Name: world_invitations_invited_user_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_invitations_invited_user_id_status_idx ON public.world_invitations USING btree (invited_user_id, status);


--
-- Name: world_invitations_token_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_invitations_token_hash_key ON public.world_invitations USING btree (token_hash);


--
-- Name: world_invitations_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_invitations_world_id_status_idx ON public.world_invitations USING btree (world_id, status);


--
-- Name: world_invite_links_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_invite_links_code_key ON public.world_invite_links USING btree (code);


--
-- Name: world_invite_links_world_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_invite_links_world_id_idx ON public.world_invite_links USING btree (world_id);


--
-- Name: world_join_requests_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_join_requests_world_id_status_idx ON public.world_join_requests USING btree (world_id, status);


--
-- Name: world_join_requests_world_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_join_requests_world_id_user_id_key ON public.world_join_requests USING btree (world_id, user_id);


--
-- Name: world_locations_parent_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_locations_parent_location_id_idx ON public.world_locations USING btree (parent_location_id);


--
-- Name: world_locations_world_id_location_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_locations_world_id_location_type_idx ON public.world_locations USING btree (world_id, location_type);


--
-- Name: world_locations_world_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_locations_world_id_slug_key ON public.world_locations USING btree (world_id, slug);


--
-- Name: world_maps_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_maps_world_id_status_idx ON public.world_maps USING btree (world_id, status);


--
-- Name: world_memberships_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_memberships_user_id_idx ON public.world_memberships USING btree (user_id);


--
-- Name: world_memberships_world_id_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_memberships_world_id_role_idx ON public.world_memberships USING btree (world_id, role);


--
-- Name: world_memberships_world_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX world_memberships_world_id_status_idx ON public.world_memberships USING btree (world_id, status);


--
-- Name: world_memberships_world_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_memberships_world_id_user_id_key ON public.world_memberships USING btree (world_id, user_id);


--
-- Name: world_whitelists_world_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX world_whitelists_world_id_user_id_key ON public.world_whitelists USING btree (world_id, user_id);


--
-- Name: worlds_owner_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX worlds_owner_user_id_idx ON public.worlds USING btree (owner_user_id);


--
-- Name: worlds_owner_user_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX worlds_owner_user_id_slug_key ON public.worlds USING btree (owner_user_id, slug);


--
-- Name: worlds_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX worlds_status_idx ON public.worlds USING btree (status);


--
-- Name: worlds_visibility_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX worlds_visibility_idx ON public.worlds USING btree (visibility);


--
-- Name: ai_summaries ai_summaries_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_summaries
    ADD CONSTRAINT ai_summaries_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ai_summaries ai_summaries_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_summaries
    ADD CONSTRAINT ai_summaries_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attachments attachments_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attachments attachments_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: audit_logs audit_logs_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_journal_entries character_journal_entries_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_journal_entries
    ADD CONSTRAINT character_journal_entries_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_journal_entries character_journal_entries_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_journal_entries
    ADD CONSTRAINT character_journal_entries_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: character_journal_entries character_journal_entries_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_journal_entries
    ADD CONSTRAINT character_journal_entries_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_memories character_memories_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_memories
    ADD CONSTRAINT character_memories_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_memories character_memories_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_memories
    ADD CONSTRAINT character_memories_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: character_memories character_memories_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.character_memories
    ADD CONSTRAINT character_memories_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters characters_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters characters_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: content_reports content_reports_reporter_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reporter_user_id_fkey FOREIGN KEY (reporter_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: content_reports content_reports_resolver_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_resolver_user_id_fkey FOREIGN KEY (resolver_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: content_reports content_reports_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_characters event_characters_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_characters
    ADD CONSTRAINT event_characters_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_characters event_characters_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_characters
    ADD CONSTRAINT event_characters_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.timeline_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: generated_artwork generated_artwork_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_artwork
    ADD CONSTRAINT generated_artwork_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: generated_artwork generated_artwork_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_artwork
    ADD CONSTRAINT generated_artwork_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: generated_artwork generated_artwork_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_artwork
    ADD CONSTRAINT generated_artwork_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: generated_artwork generated_artwork_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_artwork
    ADD CONSTRAINT generated_artwork_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lore_entries lore_entries_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lore_entries
    ADD CONSTRAINT lore_entries_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lore_entries lore_entries_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lore_entries
    ADD CONSTRAINT lore_entries_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_location_pins map_location_pins_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location_pins
    ADD CONSTRAINT map_location_pins_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.world_locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_location_pins map_location_pins_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location_pins
    ADD CONSTRAINT map_location_pins_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.world_maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationships relationships_character_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_character_a_id_fkey FOREIGN KEY (character_a_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationships relationships_character_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_character_b_id_fkey FOREIGN KEY (character_b_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: relationships relationships_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: relationships relationships_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT relationships_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scene_participants scene_participants_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_participants
    ADD CONSTRAINT scene_participants_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scene_participants scene_participants_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_participants
    ADD CONSTRAINT scene_participants_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scene_participants scene_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_participants
    ADD CONSTRAINT scene_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scene_posts scene_posts_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_posts
    ADD CONSTRAINT scene_posts_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: scene_posts scene_posts_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_posts
    ADD CONSTRAINT scene_posts_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: scene_posts scene_posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scene_posts
    ADD CONSTRAINT scene_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: scenes scenes_arc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_arc_id_fkey FOREIGN KEY (arc_id) REFERENCES public.story_arcs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: scenes scenes_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: scenes scenes_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.world_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: scenes scenes_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: story_arcs story_arcs_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_arcs
    ADD CONSTRAINT story_arcs_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_arcs story_arcs_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.story_arcs
    ADD CONSTRAINT story_arcs_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: taggings taggings_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT taggings_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tags tags_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telegram_import_messages telegram_import_messages_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_import_messages
    ADD CONSTRAINT telegram_import_messages_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.telegram_imports(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telegram_import_participants telegram_import_participants_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_import_participants
    ADD CONSTRAINT telegram_import_participants_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.telegram_imports(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telegram_import_participants telegram_import_participants_mapped_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_import_participants
    ADD CONSTRAINT telegram_import_participants_mapped_character_id_fkey FOREIGN KEY (mapped_character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: telegram_imports telegram_imports_created_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_imports
    ADD CONSTRAINT telegram_imports_created_scene_id_fkey FOREIGN KEY (created_scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: telegram_imports telegram_imports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_imports
    ADD CONSTRAINT telegram_imports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telegram_imports telegram_imports_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_imports
    ADD CONSTRAINT telegram_imports_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timeline_events timeline_events_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: timeline_events timeline_events_linked_lore_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_linked_lore_entry_id_fkey FOREIGN KEY (linked_lore_entry_id) REFERENCES public.lore_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: timeline_events timeline_events_linked_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_linked_scene_id_fkey FOREIGN KEY (linked_scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: timeline_events timeline_events_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.world_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: timeline_events timeline_events_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_blocks user_blocks_blocked_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocked_user_id_fkey FOREIGN KEY (blocked_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_blocks user_blocks_blocker_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_blocker_user_id_fkey FOREIGN KEY (blocker_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows user_follows_follower_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_user_id_fkey FOREIGN KEY (follower_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows user_follows_following_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_following_user_id_fkey FOREIGN KEY (following_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_follows world_follows_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_follows
    ADD CONSTRAINT world_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_follows world_follows_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_follows
    ADD CONSTRAINT world_follows_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_invitations world_invitations_invited_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invitations
    ADD CONSTRAINT world_invitations_invited_by_user_id_fkey FOREIGN KEY (invited_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_invitations world_invitations_invited_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invitations
    ADD CONSTRAINT world_invitations_invited_user_id_fkey FOREIGN KEY (invited_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: world_invitations world_invitations_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invitations
    ADD CONSTRAINT world_invitations_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_invite_links world_invite_links_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invite_links
    ADD CONSTRAINT world_invite_links_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_invite_links world_invite_links_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_invite_links
    ADD CONSTRAINT world_invite_links_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_join_requests world_join_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_join_requests
    ADD CONSTRAINT world_join_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_join_requests world_join_requests_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_join_requests
    ADD CONSTRAINT world_join_requests_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_locations world_locations_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_locations
    ADD CONSTRAINT world_locations_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: world_locations world_locations_parent_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_locations
    ADD CONSTRAINT world_locations_parent_location_id_fkey FOREIGN KEY (parent_location_id) REFERENCES public.world_locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: world_locations world_locations_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_locations
    ADD CONSTRAINT world_locations_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_maps world_maps_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_maps
    ADD CONSTRAINT world_maps_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_memberships world_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_memberships
    ADD CONSTRAINT world_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_memberships world_memberships_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_memberships
    ADD CONSTRAINT world_memberships_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_whitelists world_whitelists_added_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_whitelists
    ADD CONSTRAINT world_whitelists_added_by_user_id_fkey FOREIGN KEY (added_by_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_whitelists world_whitelists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_whitelists
    ADD CONSTRAINT world_whitelists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: world_whitelists world_whitelists_world_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_whitelists
    ADD CONSTRAINT world_whitelists_world_id_fkey FOREIGN KEY (world_id) REFERENCES public.worlds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: worlds worlds_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.worlds
    ADD CONSTRAINT worlds_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict UnIUHDffb82PTB7x1x0ycUgN7diz03zIUIpMlX6wp0bksQzlCcRGkNqGtyfpZRq

