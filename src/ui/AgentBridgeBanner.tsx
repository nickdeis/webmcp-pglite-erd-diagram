import { RELAY_COMMANDS, RELAY_HOST, RELAY_PORT } from '../mcp/relay'

/** Pure display: how to connect a desktop agent while the agent bridge is on. */
export function AgentBridgeBanner({ onTurnOff }: { onTurnOff: () => void }) {
  return (
    <details className="bridge-banner" open>
      <summary>
        <span>Agent bridge on</span>
        <button onClick={onTurnOff}>Turn off</button>
      </summary>
      <p>
        This tab&apos;s tools are offered to a relay on {RELAY_HOST}:{RELAY_PORT}; it connects
        automatically once one is running.
      </p>
      <ol>
        <li>
          Start the relay: <code>{RELAY_COMMANDS.start}</code>
        </li>
        <li>
          Add it to your agent, e.g. Claude Code: <code>{RELAY_COMMANDS.claudeCode}</code>
        </li>
      </ol>
      <p>Any connected agent can then read and rewrite the DDL in this tab.</p>
    </details>
  )
}
