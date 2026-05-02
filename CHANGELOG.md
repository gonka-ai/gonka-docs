# Changelog

Notable changes to the Gonka documentation site (MkDocs + Material).

## Unreleased

### Changed

- **Navigation:** Removed the separate **Wallet** section. Pages that lived under Wallet—**Dashboard**, **Pricing**, and **Wallet & transfer guide**—are now under **Other**, together with **Announcements**, **Model licenses**, **Software upgrades**, and **Transactions & governance**. This follows a flatter, [GitBook](https://www.gitbook.com/)-style sidebar: one expandable block for ancillary topics instead of many small top-level groups.
- **Chinese (`zh`):** Dropped the **Wallet** (`钱包`) section label in `nav_translations`; **Other** remains **其他**. Existing translations for wallet pages (e.g. dashboard, pricing) are unchanged.

### Fixed / polish

- **Sidebar section headers:** Collapsible groups (**Developer**, **Host**, **Other**, **Help**) use bold weight, uppercase, and normal foreground color so they no longer look like faint “inactive” labels (Material’s default `label[for]` styling).

### Tooling

- **`buildtools/sync-docs-nav.py`:** The transform for the docs-only build (`mkdocs.docs.yml`, `/docs/` on the site) now walks **nested** `nav` trees, so **Home** is still stripped and **Introduction** is still remapped to `index.md` correctly inside grouped entries.
