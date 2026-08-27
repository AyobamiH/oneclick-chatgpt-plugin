---
name: build-with-one-click
description: Use this when a user wants to turn a business idea, One Click draft or saved One Click project into a website in Lovable. Collect the brief once, prepare it with One Click, obtain confirmation before creating the external Lovable project, then use the installed Lovable plugin rather than a prompt URL.
---

# Build with One Click

Use One Click as the planning and quality layer. Use the installed Lovable plugin as the website-building layer.

1. Collect only missing essentials: business name, industry, location, primary goal and brand vibe. Headline, CTA, layout, services, audience, colours, style preset, notes and reference images are optional.
2. Call `oneclick_prepare_basic_draft` to turn the rough idea into an anonymous, structured build brief.
3. Show a compact summary of the proposed build. Creating a Lovable project is an external write, so obtain the user's confirmation immediately before that call unless their current request explicitly asks for creation.
4. Call the installed Lovable plugin's `create_project` using `lovable.initial_message`. If reference images were supplied, use Lovable's upload flow and attach only the files the user selected.
5. Render the Lovable project widget and report the project link. Do not claim it is deployed unless Lovable confirms deployment.

This initial release does not read or save One Click accounts. Never ask the user to connect an account or supply credentials. Never use the legacy `lovable.dev#prompt=` URL when the native Lovable plugin is available. Preserve the distinction between a draft, a generated project and a deployed website.
