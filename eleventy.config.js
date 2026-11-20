export default function (eleventyConfig) {
  // Copied as-is, never processed as templates.
  eleventyConfig.ignores.add("src/admin/**");
  eleventyConfig.ignores.add("src/google*.html");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/google35e7e254673779b5.html");

  // Player data files live in src/_data/players/*.json (one per player, edited via Sveltia CMS).
  // Turn that object into a list sorted by class year, then jersey number.
  eleventyConfig.addFilter("roster", (players) =>
    Object.values(players || {}).sort(
      (a, b) => Number(a.classYear) - Number(b.classYear) || Number(a.jersey) - Number(b.jersey)
    )
  );

  // Group a sorted roster into [{ year, players }] for the "Find Player by #" menu.
  eleventyConfig.addFilter("byClassYear", (list) => {
    const groups = new Map();
    for (const p of list) {
      if (!groups.has(p.classYear)) groups.set(p.classYear, []);
      groups.get(p.classYear).push(p);
    }
    return [...groups].map(([year, players]) => ({ year, players }));
  });

  eleventyConfig.addFilter("telHref", (s) => "tel:" + String(s || "").replace(/[^\d+]/g, ""));

  // Font sizes scale down for long text, matching the original hand-tuned layout.
  eleventyConfig.addFilter("positionSize", (s = "") =>
    s.length <= 16 ? "text-3xl" : s.length <= 22 ? "text-2xl" : "text-xl"
  );
  eleventyConfig.addFilter("majorSize", (s = "") => (s.length <= 17 ? "text-xs" : "text-[8px]"));
  eleventyConfig.addFilter("isNA", (s) => !s || /^n\/?a$/i.test(String(s).trim()));

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
  };
}
