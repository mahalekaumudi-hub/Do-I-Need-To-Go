export function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findServiceMatch(query, services = []) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return null;
  }

  const queryTokens = new Set(normalizedQuery.split(" ").filter(Boolean));
  let bestMatch = null;
  let bestScore = 0;

  services.forEach((service) => {
    const haystacks = [service.name, ...(service.keywords || [])];
    let score = 0;

    haystacks.forEach((entry) => {
      const normalizedEntry = normalizeText(entry);

      if (!normalizedEntry) {
        return;
      }

      if (normalizedQuery === normalizedEntry) {
        score += 180;
      }

      if (normalizedQuery.includes(normalizedEntry) || normalizedEntry.includes(normalizedQuery)) {
        score += 75;
      }

      const entryTokens = normalizedEntry.split(" ").filter(Boolean);
      const overlap = entryTokens.filter((token) => token.length > 2 && queryTokens.has(token)).length;
      score += overlap * 18;

      if (entryTokens.length > 1) {
        const queryHasLeading = entryTokens.some((token) => normalizedQuery.includes(token));
        if (queryHasLeading) {
          score += 12;
        }
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = service;
    }
  });

  return bestScore > 0 ? bestMatch : null;
}
