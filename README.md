# 2010AcademyGirls

Recruitment roster for the 2010 NC Courage Academy, built with [Eleventy](https://www.11ty.dev/) and edited
through [Sveltia CMS](https://sveltiacms.app/) at `/admin`.

## Editing content (no coding needed)

1. Go to `https://2010couragecacdemy.netlify.app/admin/` and click **Sign In with GitHub**.
2. Open **Players**, pick a player (or click **New Player**), make changes, and click **Save**.
3. The site rebuilds automatically and goes live in a minute or two.

Each player has: Position, Jersey, Photo, High School, Class, GPA, Height, ACT/SAT (box label can be switched to
Clearing House or NCAA ID#), Major, Foot, Honors & Achievements, Email, Player Phone, Parents, Parent Phone,
Highlight Film Link and a Committed badge. **Site Settings** covers the header, coach contact and footer.

Editors need a free GitHub account that has been invited to this repo as a collaborator with **Write** access.

## Where things live

| Path | What |
| --- | --- |
| `src/_data/players/*.json` | One file per player (what the CMS edits) |
| `src/_data/site.json` | Header, coach contact, master roster link, footer |
| `src/index.njk` | Page template |
| `src/assets/` | CSS, JS, images (uploaded photos land in `src/assets/images/`) |
| `src/admin/config.yml` | CMS fields and labels |

Players are ordered by class year, then jersey number. The "Find Player by #" menu is generated from the same data.

## Local development

```sh
npm install
npm start          # http://localhost:8080 (add --port=NNNN if 8080 is taken)
npm run build      # outputs to _site/
```
