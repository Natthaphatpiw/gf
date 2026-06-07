# Archetype Character Images

Place generated character PNG files in this folder. The result page loads them by archetype code and selected gender.

Filename pattern:

- `{CODE}-female.png`
- `{CODE}-male.png`

All required codes:

- `SAPB-female.png`, `SAPB-male.png`
- `SAPM-female.png`, `SAPM-male.png`
- `SAFB-female.png`, `SAFB-male.png`
- `SAFM-female.png`, `SAFM-male.png`
- `STPB-female.png`, `STPB-male.png`
- `STPM-female.png`, `STPM-male.png`
- `STFB-female.png`, `STFB-male.png`
- `STFM-female.png`, `STFM-male.png`
- `LAPB-female.png`, `LAPB-male.png`
- `LAPM-female.png`, `LAPM-male.png`
- `LAFB-female.png`, `LAFB-male.png`
- `LAFM-female.png`, `LAFM-male.png`
- `LTPB-female.png`, `LTPB-male.png`
- `LTPM-female.png`, `LTPM-male.png`
- `LTFB-female.png`, `LTFB-male.png`
- `LTFM-female.png`, `LTFM-male.png`

Image prompts live in `src/data/archetypeCharacters.ts`.

Recommended output: transparent or cream background PNG, at least 1200 x 1200 px. If a file is missing, the result page skips the image without an error.
