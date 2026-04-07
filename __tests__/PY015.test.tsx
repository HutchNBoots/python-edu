/**
 * PY-015 test suite — home page (first-visit & returning) and site navigation.
 */
import { render, screen, act } from "@testing-library/react";
import { useSkillProgress } from "@/hooks/useSkillProgress";
import { usePathname } from "next/navigation";
import HomePage from "@/app/page";
import NavLink from "@/components/NavLink";
import TitleBar from "@/components/TitleBar";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// jest.mock paths must be relative (not @/ aliases) so the module key matches at runtime
jest.mock("../hooks/useSkillProgress", () => ({
  useSkillProgress: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../components/UsernameModal", () =>
  function MockUsernameModal() {
    return <div role="dialog" aria-label="username-modal">Username modal</div>;
  }
);

jest.mock("../components/ResetProgressButton", () =>
  function MockResetProgressButton() {
    return <button>Reset my progress</button>;
  }
);

// ---------------------------------------------------------------------------
// Skill state fixtures
// ---------------------------------------------------------------------------

// No paths complete — variables easy is available
const freshSkillStates = [
  {
    id: "variables",
    name: "Variables & data types",
    category: "core" as const,
    isLocked: false,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "available" as const, xpEarned: 0 },
      { level: "mid"  as const, xpReward: 100, status: "locked"    as const, xpEarned: 0 },
      { level: "hard" as const, xpReward: 150, status: "locked"    as const, xpEarned: 0 },
    ],
  },
  {
    id: "loops",
    name: "Loops",
    category: "core" as const,
    isLocked: true,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "locked" as const, xpEarned: 0 },
      { level: "mid"  as const, xpReward: 100, status: "locked" as const, xpEarned: 0 },
      { level: "hard" as const, xpReward: 150, status: "locked" as const, xpEarned: 0 },
    ],
  },
  {
    id: "conditions",
    name: "Conditions",
    category: "core" as const,
    isLocked: true,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "locked" as const, xpEarned: 0 },
      { level: "mid"  as const, xpReward: 100, status: "locked" as const, xpEarned: 0 },
      { level: "hard" as const, xpReward: 150, status: "locked" as const, xpEarned: 0 },
    ],
  },
];

// variables easy + mid complete; next available = variables hard
const partialSkillStates = [
  {
    id: "variables",
    name: "Variables & data types",
    category: "core" as const,
    isLocked: false,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "complete"  as const, xpEarned: 50 },
      { level: "mid"  as const, xpReward: 100, status: "complete"  as const, xpEarned: 100 },
      { level: "hard" as const, xpReward: 150, status: "available" as const, xpEarned: 0 },
    ],
  },
  {
    id: "loops",
    name: "Loops",
    category: "core" as const,
    isLocked: false,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "available" as const, xpEarned: 0 },
      { level: "mid"  as const, xpReward: 100, status: "locked"    as const, xpEarned: 0 },
      { level: "hard" as const, xpReward: 150, status: "locked"    as const, xpEarned: 0 },
    ],
  },
  {
    id: "conditions",
    name: "Conditions",
    category: "core" as const,
    isLocked: false,
    paths: [
      { level: "easy" as const, xpReward: 50,  status: "available" as const, xpEarned: 0 },
      { level: "mid"  as const, xpReward: 100, status: "locked"    as const, xpEarned: 0 },
      { level: "hard" as const, xpReward: 150, status: "locked"    as const, xpEarned: 0 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockHook(overrides: Partial<ReturnType<typeof useSkillProgress>> = {}) {
  (useSkillProgress as jest.Mock).mockReturnValue({
    skillStates: freshSkillStates,
    totalXp: 0,
    completedCount: 0,
    isLoaded: true,
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// First visit (no profile in localStorage)
// ---------------------------------------------------------------------------

describe("HomePage — first visit", () => {
  beforeEach(() => {
    localStorage.clear();
    mockHook();
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders the hero section with brand mark", async () => {
    await act(async () => { render(<HomePage />); });
    // h1 contains "dragon" + ".py" as separate nodes — match on text content
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toMatch(/dragon\.py/i);
  });

  it("renders tagline", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByText(/learn python by building real things/i)).toBeInTheDocument();
  });

  it("Start learning button links to first exercise", async () => {
    await act(async () => { render(<HomePage />); });
    const link = screen.getByRole("link", { name: /start learning/i });
    expect(link).toHaveAttribute("href", "/lessons/variables/easy");
  });

  it("renders three-step explainer cards", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByText("Learn a skill")).toBeInTheDocument();
    expect(screen.getByText("Unlock projects")).toBeInTheDocument();
    expect(screen.getByText("Build things")).toBeInTheDocument();
  });

  it("renders next-up card pointing at first skill", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByText("Next up")).toBeInTheDocument();
    expect(screen.getByText("Variables & data types")).toBeInTheDocument();
  });

  it("shows UsernameModal", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByRole("dialog", { name: "username-modal" })).toBeInTheDocument();
  });

  it("does not show resume card", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Returning learner (profile in localStorage)
// ---------------------------------------------------------------------------

describe("HomePage — returning learner", () => {
  beforeEach(() => {
    localStorage.setItem("dragonpy-profile-id", "test-profile-id");
    localStorage.setItem("dragonpy-username", "Alex");
    mockHook({
      skillStates: partialSkillStates,
      totalXp: 150,
      completedCount: 0,
      isLoaded: true,
    });
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders resume card with correct username", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("does not show UsernameModal", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.queryByRole("dialog", { name: "username-modal" })).not.toBeInTheDocument();
  });

  it("metric card shows correct XP", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByLabelText(/total xp: 150/i)).toBeInTheDocument();
  });

  it("metric card shows correct paths complete count", async () => {
    await act(async () => { render(<HomePage />); });
    // partialSkillStates has 2 complete paths
    expect(screen.getByLabelText(/paths complete: 2/i)).toBeInTheDocument();
  });

  it("metric card shows day streak", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByLabelText(/day streak: 0/i)).toBeInTheDocument();
  });

  it("Continue button links to first incomplete exercise", async () => {
    await act(async () => { render(<HomePage />); });
    // First available path in partialSkillStates is variables/hard
    const continueLink = screen.getByRole("link", { name: /continue learning/i });
    expect(continueLink).toHaveAttribute("href", "/lessons/variables/hard");
  });

  it("renders skill progress bars for core skills", async () => {
    await act(async () => { render(<HomePage />); });
    expect(screen.getByLabelText(/variables.*data types.*progress/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loops.*progress/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conditions.*progress/i)).toBeInTheDocument();
  });

  it("quick link to Skills points to /skill-tree", async () => {
    await act(async () => { render(<HomePage />); });
    const skillsLink = screen.getAllByRole("link", { name: /skills/i })[0];
    expect(skillsLink).toHaveAttribute("href", "/skill-tree");
  });

  it("quick link to Projects points to /projects", async () => {
    await act(async () => { render(<HomePage />); });
    const projectsLink = screen.getAllByRole("link", { name: /projects/i })[0];
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });
});

// ---------------------------------------------------------------------------
// NavLink — active state
// ---------------------------------------------------------------------------

describe("NavLink active state", () => {
  it("is active (aria-current=page) when pathname matches / exactly", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("/ link is NOT active when pathname is /skill-tree", () => {
    (usePathname as jest.Mock).mockReturnValue("/skill-tree");
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("is active on /skill-tree when pathname is /skill-tree", () => {
    (usePathname as jest.Mock).mockReturnValue("/skill-tree");
    render(<NavLink href="/skill-tree">Skills</NavLink>);
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "page");
  });

  it("is active on /projects when pathname is /projects", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<NavLink href="/projects">Projects</NavLink>);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "page");
  });

  it("inactive links do not have aria-current", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
});

// ---------------------------------------------------------------------------
// TitleBar — brand mark and nav links
// ---------------------------------------------------------------------------

describe("TitleBar navigation", () => {
  const defaultProps = {
    skillProgress: 50,
    skillNumber: 3,
    totalSkills: 9,
    streak: 2,
    totalXp: 150,
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("brand mark is a link to /", () => {
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: /dragon\.py home/i })).toHaveAttribute("href", "/");
  });

  it("renders Home nav link", () => {
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("renders Skills nav link pointing to /skill-tree", () => {
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skill-tree");
  });

  it("renders Projects nav link pointing to /projects", () => {
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
  });

  it("Home nav link is active when pathname is /", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("Skills nav link is active when pathname is /skill-tree", () => {
    (usePathname as jest.Mock).mockReturnValue("/skill-tree");
    render(<TitleBar {...defaultProps} />);
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "page");
  });
});
