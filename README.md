# Pi Herdr ask-user bridge

Reports an rpiv `ask_user_question` questionnaire as **blocked** in Herdr while it awaits input, then clears the state when it closes. Supports overlapping questionnaires and session shutdown. It does not forward questions or answers, and it does not provide a remote questionnaire UI.

## Requirements

- Pi coding agent in an interactive Herdr pane, with Herdr's Pi agent-state integration installed.
- [`@juicesharp/rpiv-ask-user-question`](https://www.npmjs.com/package/@juicesharp/rpiv-ask-user-question), installed separately.
- Node.js 22.18 or newer.

## Install

```sh
pi install npm:@juicesharp/rpiv-ask-user-question
pi install npm:pi-herdr-ask-user-bridge
```

Restart Pi or run `/reload`. If you previously installed a standalone copy of this bridge in `~/.pi/agent/extensions/`, remove that copy to avoid duplicate reports. Outside Herdr the bridge has no visible effect.

The bridge listens for `rpiv:ask-user:blocked` events and forwards balanced `herdr:blocked` events to the Herdr-managed extension. Herdr determines how blocked states appear in its UI.

## Development

Run `npm test` with Node.js 22.18 or newer. The test uses a mock Pi event bus; a live Herdr UI is required for end-to-end verification.

MIT licensed.
