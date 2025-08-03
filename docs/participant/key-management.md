# Key Management Architecture

This document describes the comprehensive key management architecture for Gonka Network, a decentralized AI infrastructure that requires robust security through role-based key separation.

## Overview

Gonka Network implements a **role-based key management system** that separates automated functions from high-stakes manual approvals. This architecture ensures that no single key controls all network operations, providing enhanced security and operational flexibility.

!!! info "Quick Setup"
    For immediate deployment, see the [Quickstart Guide](/participant/quickstart/). This document focuses on understanding the complete key management architecture and security model.

## Key Architecture at Launch (v0)

At network launch, participants use a **three-key system**:

| Key Type | Purpose | Storage | Algorithm | Usage |
|----------|---------|---------|-----------|-------|
| **Account Key** | Master control & permissions | Secure local machine | SECP256K1 | Manual high-stakes operations |
| **ML Operational Key** | Automated AI transactions | Encrypted on server | SECP256K1 | Automated ML workflows |
| **Consensus Key** | Block validation & consensus | TMKMS warm storage | ED25519 | Network consensus participation |

## Security Model

### Account Key (Cold Wallet) - **CRITICAL**
- **Control**: Master key that grants permissions to all other keys
- **Security**: Must be stored offline on a secure, air-gapped machine
- **Usage**: Only for granting permissions and validator registration
- **Recovery**: Protected by mnemonic phrase - **if lost, all access is permanently lost**

### ML Operational Key (Warm Wallet)
- **Control**: Authorized by Account Key for ML-specific transactions
- **Security**: Encrypted file on server, accessed programmatically
- **Usage**: Automated transactions (inference requests, proof submissions, rewards)
- **Recovery**: Can be rotated/revoked by Account Key at any time

### Consensus Key (TMKMS - Warm Storage)
- **Control**: Managed by secure TMKMS service
- **Security**: Warm storage with double-signing prevention
- **Usage**: Block validation and network consensus participation
- **Recovery**: Can be rotated by Account Key or authorized delegates

## Planned Evolution

### Phase 1: Enhanced Security (v1)

**New Capabilities:**
- **Governance Key**: Dedicated key for protocol voting and parameter changes
- **Treasury Key**: Separate key for fund management and high-value transfers  
- **Multi-signature Groups**: Hardware wallet integration with x/group module
- **Enhanced Permissions**: Granular authorization for different operation types

#### Key Types in v1

| Key Type | Purpose | Storage | Who Has |
|----------|---------|---------|---------|
| **Account Key** | Master control (Multi-sig) | Hardware wallets | Highest level stakeholders |
| **Governance Key** | Protocol voting & parameter changes | Cold wallet (Multi-sig) | High level stakeholders |
| **Treasury Key** | Fund management & high-value transfers | Cold wallet (Multi-sig) | Financial stakeholders |
| **ML Operational Key** | Automated AI workloads | Warm wallet | Server automation |
| **Consensus Key** | Block validation | TMKMS warm storage | Validator infrastructure |

### Long-term Vision: Enterprise-grade Security
- **Hardware Wallet Integration**: Full support for Ledger, Trezor, and enterprise HSMs
- **Multi-signature Governance**: Distributed decision-making with configurable thresholds
- **Maintenance Keys**: Dedicated keys for routine operations like consensus key rotation
- **Audit Trail**: Complete cryptographic audit trail for all key operations

## Best Practices

### Security Guidelines

1. **Account Key Protection** 
    - **Secure Machine Requirements**: Use a dedicated machine with:
        - Minimal exposure to the public internet (air-gapped is best)
        - Minimal software installation (not used for daily web browsing or email)
        - Encrypted hard drive with full disk encryption
        - Restricted physical and remote access
    - **Storage**: Store on secure local machine with encrypted storage
    - **Passphrases**: Use strong, unique passphrases for keyring protection
    - **Backup**: Maintain offline backup of mnemonic phrase in secure location
    - **Usage**: Never use for routine operations - only for granting permissions and validator actions

2. **Hardware Wallet Support**
    - **Current Limitation**: Hardware wallets are not supported at network launch
    - **Timeline**: Hardware wallet integration is a high priority and will be available in upcoming network upgrades
    - **Future Support**: Popular hardware wallets and enterprise security modules will be supported
    - **Interim Security Strategy**:
        - Use a dedicated machine with minimal internet exposure when possible
        - Protect keys with strong, unique passphrases
        - Enable full disk encryption on the machine storing keys
        - Avoid using the same machine for daily browsing/email
    - **Migration Path**: Once hardware wallet support is available, you can import your existing mnemonic phrase
    - **Critical Reminder**: Always save and securely store your mnemonic phrase - it's your ultimate recovery method

3. **Operational Security**
     - Regularly rotate ML Operational Keys using Account Key authorization
     - Implement proper backup and recovery procedures for all keys
     - Use `file` keyring backend with strong passphrases for all key storage
     - Test key recovery procedures in safe environment before production deployment



### Recovery Procedures
1. **Account Key Loss**: **CRITICAL** - No recovery possible without mnemonic
2. **ML Operational Key Loss**: Create new key and re-authorize with Account Key
3. **Consensus Key Loss**: Rotate consensus key using Account Key authorization

## Multi-signature Groups (v1 Advanced)

```
Company Participant:
├── Account Key → Secure Storage + Multi-sig
├── ML Operational Key → Automated AI workloads
├── Governance Group → Multi-sig for protocol votes
│   ├── CEO/Founder
│   ├── CTO/Tech Lead  
│   └── Head of Operations
└── Treasury Group (Optional) → Separate multi-sig for high-value transfers
    ├── CEO/Founder
    ├── CFO/Finance Lead
    └── Board Member
```

---

!!! warning "Production Deployment"
    Before deploying to production, ensure you understand the complete key management workflow and have tested key recovery procedures in a safe environment.

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with key management, security concerns, or technical issues.