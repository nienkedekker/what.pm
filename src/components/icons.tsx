import {
  SunIcon,
  MoonIcon,
  HouseIcon,
  AirplaneIcon,
  NotePencilIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  RssIcon,
  ArrowRightIcon,
  LinkIcon,
} from '@phosphor-icons/react';

// Nav icons
export function HomeIcon() {
  return <HouseIcon size={18} weight="duotone" className="sm:w-4 sm:h-4" />;
}

export function LinksIcon() {
  return <LinkIcon size={18} weight="duotone" className="sm:w-4 sm:h-4" />;
}

export function TripsIcon() {
  return <AirplaneIcon size={18} weight="duotone" className="sm:w-4 sm:h-4" />;
}

export function NotesIcon() {
  return <NotePencilIcon size={18} weight="duotone" className="sm:w-4 sm:h-4" />;
}

export function NowIcon() {
  return <ClockIcon size={18} weight="duotone" className="sm:w-4 sm:h-4" />;
}

// Theme toggle icons
export function ThemeToggleIcons() {
  return (
    <>
      <SunIcon size={20} weight="duotone" className="hidden dark:block" />
      <MoonIcon size={20} weight="duotone" className="block dark:hidden" />
    </>
  );
}

// Post card icons
export function PostCalendarIcon() {
  return <CalendarIcon size={14} weight="duotone" />;
}

export function PostMapPinIcon() {
  return <MapPinIcon size={14} weight="duotone" />;
}

// Footer icons
export function FooterEmailIcon() {
  return <EnvelopeIcon size={16} weight="duotone" />;
}

export function FooterGithubIcon() {
  return <GithubLogoIcon size={16} weight="duotone" />;
}

export function FooterLinkedinIcon() {
  return <LinkedinLogoIcon size={16} weight="duotone" />;
}

export function FooterRssIcon() {
  return <RssIcon size={16} weight="duotone" />;
}

// Arrow icon
export function ViewAllArrowIcon() {
  return <ArrowRightIcon size={14} weight="bold" />;
}
