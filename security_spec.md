# Security Specification

## Data Invariants
1. `settings/app_config` stores the global birthday celebration configuration.
2. Any visitor can read `settings/app_config` so the celebration displays customized settings on all devices.
3. Updates to `settings/app_config` must strictly validate all field types, enums, string boundaries, and required keys.

## Dirty Dozen Security Test Cases
1. Missing `recipientName`: rejected.
2. `recipientName` longer than 100 characters: rejected.
3. Invalid `theme` enum value: rejected.
4. Invalid `cakeStyle` enum value: rejected.
5. Non-boolean `soundEnabled`: rejected.
6. Unknown ghost keys outside allowlist: rejected.
