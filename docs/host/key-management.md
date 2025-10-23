# Key Management Architecture

This document describes the comprehensive key management architecture for Gonka Network, a decentralized AI infrastructure that requires robust security through role-based key separation.

## Overview

Gonka Network implements a **role-based key management system** that separates automated functions from high-stakes manual approvals. This architecture ensures that no single key controls all network operations, providing enhanced security and operational flexibility.

!!! info "Quick Setup"
    For immediate deployment, see the [Quickstart Guide](/host/quickstart/). This document focuses on understanding the complete key management architecture and security model.

## Key Architecture at Launch (v0)

At network launch, Hosts use a **three-key system**:

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
  
## Best Practices

### Security Guidelines

1. **Account Key Protection** 
    - **Storage**: Secure local machine with encrypted storage and minimal internet exposure
        - *Secure local machine*: A dedicated computer with restricted access, not used for daily browsing/email, ideally air-gapped or with limited network connectivity
    - **Keyring Backend**: Use `file` or `os` keyring backend for secure local storage
    - **Passphrases**: Use strong, unique passphrases for keyring protection
    - **Backup**: Maintain offline backup of mnemonic phrase in secure location
    - **Usage**: Never use for routine operations - only for granting permissions and validator actions

2. **Hardware Wallet Support**
    - **Current Status**: Not supported at network launch 
    - **Critical**: Always save and securely store your mnemonic phrase as your ultimate recovery method

3. **ML Operational Key Management**
     - **Keyring Backend**: Must use `file` keyring backend for server-based storage with programmatic access
     - **Security**: Store encrypted on server with strong passphrase protection
     - **Rotation**: Regularly rotate ML Operational Keys using Account Key authorization
     - **Access**: Enable programmatic access by containers while maintaining encryption at rest

4. **Operational Security**
     - Implement proper backup and recovery procedures for all keys
     - Test key recovery procedures in safe environment before production deployment
     - Monitor and audit key usage patterns

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

**Need help?** Join our [Discord server](https://discord.com/invite/RADwCT2U6R) for assistance with key management, security concerns, or technical issues.
