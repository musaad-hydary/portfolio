import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {
  SiApplemusic,
  SiSpotify,
  SiSoundcloud,
  SiYoutube,
  SiTidal,
  SiBandcamp,
  SiDeezer,
} from "react-icons/si";
import { MdMusicNote } from "react-icons/md";

const platforms = [
  { label: "apple music",   url: "https://music.apple.com/us/artist/musaad/1526694668",          Icon: SiApplemusic },
  { label: "spotify",       url: "https://open.spotify.com/artist/7yMQXEqgEJHNLdYff22ifb",      Icon: SiSpotify    },
  { label: "youtube",       url: "https://www.youtube.com/channel/UC1rn-6rTeA9ujknw_alCAsQ",    Icon: SiYoutube    },
  { label: "soundcloud",    url: "https://soundcloud.com/mhydary",                               Icon: SiSoundcloud },
  { label: "tidal",         url: "https://tidal.com/artist/20804914",                            Icon: SiTidal      },
  { label: "amazon music",  url: "https://www.amazon.com/music/player/artists/B08FD7YZWJ/musaad", Icon: MdMusicNote },
  { label: "deezer",        url: "https://www.deezer.com/us/artist/103220082",                   Icon: SiDeezer    },
  { label: "bandcamp",      url: "https://musaad.bandcamp.com/",                                 Icon: SiBandcamp   },
];

const pointerCursor = "url('/cursor-pointer.png') 8 1, pointer";

export default function Music() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      <Nav />
      <div className="max-w-[800px] mx-auto px-7 pt-24 pb-16">
        <div className="py-6 border-b" style={{ borderColor: "var(--bdr)" }}>
          <div className="flex items-center gap-4">
            <img
              src="/avatar.jpg"
              alt="musaad"
              loading="lazy"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                filter: "sepia(1) brightness(0.8)",
              }}
            />
            <h1
              style={{
                fontFamily: "Dreamer, serif",
                color: "var(--c)",
                fontSize: "clamp(2.6rem, 6vw, 3.5rem)",
                lineHeight: 1,
                letterSpacing: "0.04em",
              }}
            >
              musaad
            </h1>
          </div>
          <p
            className="mt-3"
            style={{
              fontFamily: "DM Mono, monospace",
              color: "var(--cd)",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              fontWeight: 300,
            }}
          >
            select your platform of choice
          </p>
        </div>

        <div>
          {platforms.map(({ label, url, Icon }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between py-4 border-b group transition-all duration-150"
              style={{
                borderColor: "var(--bdr-faint)",
                textDecoration: "none",
                cursor: pointerCursor,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div className="flex items-center gap-4" style={{ paddingLeft: "1rem" }}>
                <Icon
                  size={16}
                  style={{ color: "var(--col-muted)", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    color: "var(--c)",
                    fontWeight: 300,
                  }}
                >
                  {label}
                </span>
              </div>
              <span
                style={{
                  color: "var(--col-muted)",
                  fontSize: "0.85rem",
                  transition: "transform 0.15s ease, color 0.15s ease",
                  paddingRight: "1rem",
                }}
                className="group-hover:text-[var(--c)]"
              >
                ↗
              </span>
            </a>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}
