import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Stroke>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </Stroke>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5.5 3.5h3l1.6 4.2-2 1.5a12 12 0 0 0 6.7 6.7l1.5-2 4.2 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </Stroke>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.500 7" />
    </Stroke>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.900 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Stroke>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m5 12.500 4.500 4.500L19 7.500" />
    </Stroke>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.500v5.500M12 16.500h.01" />
    </Stroke>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 16.500v-3.200l1.900-5a2 2 0 0 1 1.900-1.300h8.400a2 2 0 0 1 1.900 1.300l1.900 5v3.200a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <path d="M4.500 12.500h15M6.500 17.500v1.500M17.500 17.500v1.500" />
      <circle cx="7.500" cy="14.800" r=".6" fill="currentColor" stroke="none" />
      <circle cx="16.500" cy="14.800" r=".6" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function BusIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="4" y="4" width="16" height="13.500" rx="2.500" />
      <path d="M4 11.500h16M7 17.500v2M17 17.500v2M12 4v7.500" />
      <circle cx="7.800" cy="14.500" r=".6" fill="currentColor" stroke="none" />
      <circle cx="16.200" cy="14.500" r=".6" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.500 8.500-2 5-5 2 2-5 5-2Z" />
    </Stroke>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.500" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.500" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.030-.967-.273-.099-.471-.148-.670.150-.197.297-.767.966-.940 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.390-1.475-.883-.788-1.480-1.761-1.653-2.059-.173-.297-.018-.458.130-.606.134-.133.298-.347.446-.520.149-.174.198-.298.298-.497.099-.198.050-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.500-.669-.510-.173-.008-.371-.010-.570-.010-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.360.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.870 9.870 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.860 9.860 0 0 1-1.510-5.260c.001-5.450 4.436-9.884 9.888-9.884 2.640 0 5.122 1.030 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.450-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.050 0C5.495 0 .160 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.480-8.413Z" />
    </svg>
  );
}
