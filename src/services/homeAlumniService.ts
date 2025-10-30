export interface FeaturedAlumni {
  id: string;
  fullName: string;
  profilePicture: string;
  sscYear: string;
  hscYear: string;
  profession: string;
  organization: string;
  profileCompletionScore: number;
  slug: string;
}

export class HomeAlumniService {
  private static buildUrl(path: string) {
    // adjust base if you use a proxy / env var
    return `/api${path}`;
  }

  private static generateSlug(name: string, sscYear: string): string {
    const nameSlug = (name || 'unknown')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${nameSlug}-${sscYear || ''}`;
  }

  private static calculateCompletionScore(payload: any): number {
    let score = 0;
    const max = 5;
    if (payload.profile_photo || payload.profilePicture || payload.image) score += 1;
    if (payload.full_name || payload.fullName || payload.name) score += 1;
    if (payload.profession) score += 1;
    if (payload.organization) score += 1;
    if ((payload.ssc_year || payload.sscYear || payload.ssc_batch) && (payload.hsc_year || payload.hscYear || payload.hsc_batch)) score += 1;
    return Math.round((score / max) * 100);
  }

  private static shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private static normalizeItem(a: any): FeaturedAlumni {
    const id = String(a.id ?? a.uuid ?? a.slug ?? a._id ?? Math.random().toString(36).slice(2));
    const fullName = a.full_name ?? a.fullName ?? a.name ?? 'Unknown';
    const profilePicture = a.profile_photo ?? a.image ?? a.profilePicture ?? '';
    const sscYear = String(a.ssc_year ?? a.sscYear ?? a.ssc_batch ?? '');
    const hscYear = String(a.hsc_year ?? a.hscYear ?? a.hsc_batch ?? '');
    const profession = a.profession ?? '';
    const organization = a.organization ?? a.org ?? 'Not specified';
    const profileCompletionScore = typeof a.profileCompletionScore === 'number' ? a.profileCompletionScore : this.calculateCompletionScore(a);
    const slug = a.slug ?? this.generateSlug(fullName, sscYear);

    return {
      id,
      fullName,
      profilePicture,
      sscYear,
      hscYear,
      profession,
      organization,
      profileCompletionScore,
      slug
    };
  }

  private static filterQualified(alumni: FeaturedAlumni[], minScore = 80): FeaturedAlumni[] {
    return alumni.filter(a =>
      (a.profileCompletionScore ?? 0) >= minScore &&
      !!a.profilePicture &&
      !!a.fullName &&
      !!a.profession &&
      !!a.organization &&
      !!a.sscYear &&
      !!a.hscYear
    );
  }

  /**
   * Fetch featured alumni from backend.
   * Expects backend endpoint: GET /api/alumni/featured?limit=40
   * Response: either { alumni: [...] } or an array [...]
   */
  static async getFeaturedAlumni(limit = 20): Promise<FeaturedAlumni[]> {
    try {
      const url = this.buildUrl(`/alumni/featured?limit=${encodeURIComponent(limit)}`);
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        console.warn('homeAlumniService.getFeaturedAlumni: backend returned', res.status);
        return [];
      }
      const payload = await res.json();
      // Accept multiple backend shapes: plain array, { alumni: [...] }, or Laravel paginator { data: [...] }
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any).alumni)
          ? (payload as any).alumni
          : Array.isArray((payload as any).data)
            ? (payload as any).data
            : [];
      const mapped = items.map((i: any) => this.normalizeItem(i));
      // keep server ordering; still apply qualification filter client-side
      const qualified = this.filterQualified(mapped, 80);
      return qualified.slice(0, limit);
    } catch (err) {
      console.error('homeAlumniService.getFeaturedAlumni error:', err);
      return [];
    }
  }

  /**
   * Get alumni items for the flowing rows animation.
   * This requests more items and duplicates/shuffles to ensure enough cards.
   */
  static async getAlumniForFlowingRows(): Promise<{ topRow: FeaturedAlumni[]; bottomRow: FeaturedAlumni[] }> {
    try {
      const featured = await this.getFeaturedAlumni(50);
      if (!featured || featured.length === 0) return { topRow: [], bottomRow: [] };

      let expanded = [...featured];
      while (expanded.length < 40) {
        expanded = expanded.concat(this.shuffleArray(featured).slice(0, Math.min(featured.length, 40 - expanded.length)));
        if (featured.length === 0) break;
      }

      const midpoint = Math.ceil(expanded.length / 2);
      return {
        topRow: this.shuffleArray(expanded.slice(0, midpoint)),
        bottomRow: this.shuffleArray(expanded.slice(midpoint))
      };
    } catch (err) {
      console.error('homeAlumniService.getAlumniForFlowingRows error:', err);
      return { topRow: [], bottomRow: [] };
    }
  }

  static getProfileCompletionCriteria() {
    return {
      requiredFields: ['profilePicture', 'fullName', 'sscYear', 'hscYear', 'profession', 'organization'],
      minimumCompletionScore: 80
    };
  }
}

export const homeAlumniService = new HomeAlumniService();