export interface GoogleMapsLocationConfig {
        locality?: string;
        province?: string;
        country?: string;
        zoom?: number;
        language?: string;
}

export interface GoogleMapsPreviewUrls {
        embedUrl: string;
        placeUrl: string;
}

const GOOGLE_MAPS_EMBED_BASE_URL = 'https://maps.google.com/maps';
const GOOGLE_MAPS_PLACE_BASE_URL = 'https://www.google.com/maps';
const GOOGLE_MAPS_PLACE_PATH = '/place/';
const DEFAULT_COUNTRY = 'Argentina';
const DEFAULT_LANGUAGE = 'es';
const DEFAULT_ZOOM = 13;
const MIN_ZOOM = 1;
const MAX_ZOOM = 21;

const LANGUAGE_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/u;

function normalizeZoom(zoom: number | undefined): number {
        if (!Number.isFinite(zoom)) {
                return DEFAULT_ZOOM;
        }

        const roundedZoom = Math.round(zoom as number);
        return Math.min(Math.max(roundedZoom, MIN_ZOOM), MAX_ZOOM);
}

function normalizeLanguage(language: string | undefined): string {
        const trimmed = language?.trim();

        if (!trimmed || !LANGUAGE_PATTERN.test(trimmed)) {
                return DEFAULT_LANGUAGE;
        }

        return trimmed;
}

function sanitizePart(value?: string): string | null {
        const trimmed = value?.trim();

        if (!trimmed) {
                return null;
        }

        return trimmed.replace(/\s+/gu, ' ');
}

function buildSearchableParts(config: GoogleMapsLocationConfig): string[] | null {
        const sanitizedLocality = sanitizePart(config.locality);
        const sanitizedProvince = sanitizePart(config.province);

        if (!sanitizedLocality || !sanitizedProvince) {
                return null;
        }

        const sanitizedCountry = sanitizePart(config.country) ?? DEFAULT_COUNTRY;

        return [sanitizedLocality, sanitizedProvince, sanitizedCountry];
}

export function buildGoogleMapsPreviewUrls(
        config: GoogleMapsLocationConfig = {}
): GoogleMapsPreviewUrls | null {
        const searchableParts = buildSearchableParts(config);

        if (!searchableParts) {
                return null;
        }

        const language = normalizeLanguage(config.language);
        const zoom = normalizeZoom(config.zoom);
        const placeLabel = searchableParts.join(', ');

        const embedParams = new URLSearchParams({
                q: placeLabel,
                hl: language,
                z: String(zoom),
                t: '',
                ie: 'UTF8',
                iwloc: 'B',
                output: 'embed'
        });

        const embedUrl = `${GOOGLE_MAPS_EMBED_BASE_URL}?${embedParams.toString()}`;

        const placeUrl = `${GOOGLE_MAPS_PLACE_BASE_URL}${GOOGLE_MAPS_PLACE_PATH}${encodeURIComponent(
                placeLabel
        )}?hl=${language}`;

        return { embedUrl, placeUrl };
}

export function buildGoogleMapsEmbedUrl(config: GoogleMapsLocationConfig = {}): string {
        return buildGoogleMapsPreviewUrls(config)?.embedUrl ?? '';
}

export function buildGoogleMapsPlaceUrl(config: GoogleMapsLocationConfig = {}): string {
        return buildGoogleMapsPreviewUrls(config)?.placeUrl ?? '';
}