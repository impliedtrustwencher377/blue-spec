---
id: intro
title: 🌊 Blue Spec
sidebar_label: Introduction
slug: /
description: Security-Driven Hardening for software built with AI agents.
---

# 🌊 Blue Spec: Security-Driven Hardening

**Blue Spec** helps your AI agent make a project more secure. You point it at your code, the agent figures out what your system actually does, then it guides you through the security work that matters for it.

- **Blue Spec** works with projects in **any programming language** and supports **37 agents** ✨

## The idea in one line

Instead of running a generic checklist, Blue Spec detects the context of your system (login, file uploads, payments, and so on), then drives the fixes specific to that context.

The intelligence lives in the spec, not in the user. A developer and a non-developer are served through the same flow, and every finding stays in plain language so you can act on it regardless of your technical depth.

## The five-phase flow

Blue Spec runs a structured lifecycle, with every phase framed around defense.

| #   | Command                                       | What it does for you                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | [`/bluespec.charter`](./commands/charter.mdx) | Sets your project's security rules.                                     |
| 2   | [`/bluespec.detect`](./commands/detect.mdx)   | Reads your code and maps what your system does and where the risks are. |
| 3   | [`/bluespec.plan`](./commands/plan.mdx)       | Turns what detect found into a defense plan, a fix for each finding.    |
| 4   | [`/bluespec.harden`](./commands/harden.mdx)   | Applies the plan's fixes to your code, safely and one at a time.        |
| 5   | [`/bluespec.verify`](./commands/verify.mdx)   | Proves each applied fix holds and closes out the ones that do.          |

Each command builds on the previous, so following the list top to bottom is all it takes.

:::tip[Security is an investment]

Security is not a cost, it is an investment: what you put in upfront, you save many times over in the incidents you never have 🙋🏻‍♂️
:::

## Where to go next

- New here? Start with [**Install**](./get-started/install.md).
- Want the command map? See [**Commands**](./get-started/commands.md).
- Curious about the on-demand knowledge? Read [**Available Skills**](./skills.mdx).
