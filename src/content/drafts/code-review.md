# How to make Anthropic code-review skill actually work?

***A practical playbook for turning AI code review from noise into something which can actually free your time.***

The official [code-review plugin](https://github.com/anthropics/claude-code/tree/main/plugins/code-review) didn't work for me. Its reasoning looked flawless, the steps looked right, but the review it produced was not par to my manual reviews. 

What I want to share with you is my way of making a customized code review skill which actually works for your usecase. 

## What will be covered?

Mental model for a Skill

Code Review Plugin

Does it work?

How did I make it work?

Can we auto evolve it though?

Conclusion

## Mental model for a Skill

A skill is a reusable, polished prompt - which can be invoked by you or Claude Code anytime when required. You store this polished prompt in a markdown file named **`SKILL.md`**. 

So for example, here is the most starred [repository](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md) on claude skills based on Andrej Karpathy 🐐 guidelines. 


You may have realised that **`SKILL.md`** looks a little long and little non humanish, but don't worry, mostly you will not write a skill yourself, there is a skill **`/skill-creator`** for writing skills which is by default enabled in Claude Code. 

Additionally, Skills can include multiple files in their directory. This keeps **`SKILL.md`** focused on the essentials while letting model access detailed reference material only when needed. Example from official documentation:

```markdown
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

If you haven't already, you will be creating your first Claude Code skill by the end of this blog. 

<aside>
💡

Here are the official [skills](https://github.com/anthropics/skills) provided out of the box from Anthropic, if you are interested. There is more to skills, which you can read in detail [here](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

</aside>

## Official Code Review Plugin
 
I generally spend 30% of my week reviewing code and it’s been increasing every week since AI made code generation so easy. So the first thing I wanted to automate were code reviews. In my search of code review plugin I bumped into the Anthropic official [code-review](https://github.com/anthropics/claude-code/tree/main/plugins/code-review) plugin. It’s written very well, as the doc says, it does following steps:

```markdown
Summarizes the pull request changes
Launches 4 parallel agents to independently review:
Agents #1 & #2: Audit for CLAUDE.md compliance
Agent #3: Scan for obvious bugs in changes
Agent #4: Analyze git blame/history for context-based issues
Scores each issue 0-100 for confidence level
Filters out issues below 80 confidence threshold
Outputs review (to terminal by default, or as PR comment with --comment flag)

```

## Though, does it work?

<aside>
😶‍🌫️

My happiness was short lived.

</aside>

When I installed it and let it review a PR, it sucks in two ways:

- It takes shit ton of tokens to complete, 4 parallel agents were hurting my usage limits
- Even after these many tokens, the review was nowhere near to my reviews. It doesn’t have clude about the standard coding practices we follow, the file structure, the usage of commons folder and other org. level context.

Don’t get me wrong, it did find security bugs very well, which was better than mine but it lacked the originality. 

<aside>
💡

*Btw, you may have to install [Github MCP server](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md) in you Claude Code if it’s not there.* 

</aside>

## How did I make it work?

<h2> Organization context!</h2>

An idea: what if I create my own code review skill based on the corpus data of the past reviews done by me and my colleagues. 
So, I took the 50+ most-commented PRs and asked Claude Code to build a review skill from them. We maintain Separation of Concern using the abstraction of apps in our codebase hence the instruction I gave to Claude Code was along this line:

```markdown
Using /skill-creator I want you to write a code review skill named simbian-review, the way senior engineers would do — architecturally aware, and grounded in the project's actual conventions. We will use this skill to review any pull request and publish comments in draft mode on github.  
In SKILL.md, I want you to write standard practises which is required for all the code reviews. Create a references folder, and in that create reference file for particular apps which can be used for reviewing just those. SKILL.md should talk about the navigation for references based on changes in which app folder. 
Data Corpus: Here are the past pull requests for you to fetch comments from and understand the context:
app_xxx -> 123, 156, ...
app_yyy -> 1345, 1456 ...
...
...

Don't skip any PRs, ask me any questions if you have any, don't take assumptions.
```

After few two and fro, Claude created a skill for me which had following directory tree:

```markdown
├── simbian-review
│   ├── evals
│   │   └── evals.json
│   ├── references
│   │   ├── <user>.md
│   │   ├── abc.md
│   │   ├── ...
│   │   ├── ...
│   └── SKILL.md
```

Now, it was time to test it! I ran the skill on a recent PR I reviewed myself so that I can compare it apples to apples. I was excited to see it’s results so much so that I couldn’t wait for that agent session to complete. 

### Results

- It didn’t take my whole usage limit, in fact it ran and completed within few minutes. Light on tokens and fast to complete.
- The comments were deeply contextual, architectural and followed my style of reviewing: asking questions instead of giving answers.

## Can we auto evolve it though?

For first few weeks the skill was performing good, I was reviewing the review comments from Claude Code. But then reality hits, as a startup we churn out new architecture every week: my skill didn’t know this new piece of code. 

<aside>
💡

In simple words: it’s not evolving with me. 

</aside>

I realized it’s a perfect use case for Claude Code [**routine**](https://claude.com/blog/introducing-routines-in-claude-code), a cron which does a task at a particular time you tell it to repeatedly. But I didn't want my routine to update the skill directly, so I created a private repository for all my skills. Now routine's goal is to create a pull request with updates to skill. I can review or edit those changes, and once merged I can pull into my local to have an updated version. 

I used `/schedule` in Claude Code to create a new routine. I described the task in free form, an it created a polished version for me after asking few questions. Here is the final version of routine task:

```markdown
You are running a weekly skill-improvement job.

Goal: improve the `simbian-review` skill at `skills/simbian-review/SKILL.md` based on patterns from the 5 most-commented PRs in **<simbian repo>** that were reviewed by @vedang122 OR @<user> in the last 90 days.

Steps:
1. In the **<simbian repo>** clone, use `gh` to query PRs:
   - Closed/merged in the last 90 days
   - Reviewed by vedang122 OR <user> (look at PR reviews, not just comments)
   - Sort by total comment count (issue comments + review comments)
   - Take the top 5
2. For each of those 5 PRs, pull:
   - The diff (focus on what changed)
   - All review comments with file:line context
   - **Skip all the comments with prefix [claude-code] since that is not done by human**
   - Any back-and-forth discussion threads
3. Read the current `skills/simbian-review/SKILL.md` and any files under `skills/simbian-review/references/` in the vedang122/skills clone.
4. Synthesize: what recurring review patterns / heuristics / red flags do vedang122 and <user> apply that the current skill does NOT yet capture? Focus on architecture, correctness, DB, async — light on style nits.
5. Use the `/skill-creator` skill (skill-creator:skill-creator) to update `simbian-review` — add new references in case new components were added, sharpen existing ones, add concrete examples (anonymized if needed, but PR numbers are fine to cite).
6. In the vedang122/skills clone:
   - Create a branch: `weekly-skill-update-YYYY-MM-DD`
   - Commit the changes with a clear message listing which PRs informed each new heuristic
   - Open a PR titled `Weekly simbian-review update: <date>` with a body summarizing: (a) which 5 PRs were analyzed, (b) what new heuristics were added, (c) what was sharpened, (d) anything intentionally skipped.

If you find no meaningful patterns worth adding this week, DO NOT open a noisy PR. Instead, close out by reporting "no update needed this week" with a one-paragraph explanation of what you reviewed.

Tools allowed: Bash, Read, Write, Edit, Glob, Grep — plus the skill-creator skill.
```

Every Monday morning I review my pull requests to skills repo, edit them if need be, merge them, pull them in my local and I have an updated code review skill for the upcoming week. 

## Conclusion

Skills are not as trivial as plug-and-play. A skill is only as good as the context you feed it; the leverage is yours to supply. Be creative!