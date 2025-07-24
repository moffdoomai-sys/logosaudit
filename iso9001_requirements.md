# ISO 9001 Audit Tool Requirements Summary

## Overview
This document outlines the specific requirements for creating an ISO 9001 audit tool based on the user's conversation with Abacus. The user is a certified Lead Auditor who needs to audit contractors (Delivery Partners) but lacks practical auditing experience.

## User Context
- **Role**: Lead Auditor (certified but inexperienced in practical auditing)
- **Industry**: Water and Wastewater Utilities Industry in Queensland, Australia
- **Target**: Auditing contractors/Delivery Partners with Quality Management Plans (QMPs)
- **Standards**: Some contractors follow ISO 9001, others have custom QMPs

## Core Audit Tool Features Requested

### 1. Dropdown Selection System
- Select audit scope from dropdown options:
  - ISO 9001 standard
  - Delivery Partner's Quality Management Plan (uploaded)
  - Combination of both QMP and ISO 9001
  - Multiple audit types: Quality, Safety, Environment (selectable)

### 2. Question Structure (Parent-Child Relationship)
- **Parent Questions**: Primary audit questions
- **Child Questions**: 2-3 follow-up questions per parent
- **Conditional Logic**: Child questions only appear if parent question cannot be answered directly
- **ISO References**: Each question must reference specific ISO 9001 clauses (e.g., "ISO 9001:2015, Clause 5.1")

### 3. Evidence Management
- Upload capability for documents and photos as evidence
- Evidence attachment for each question/finding
- Two types of evidence handling:
  - **Cited/Visually Looked At**: Visual inspection or brief document review
  - **Record Captured**: Formal documentation required as artifact

### 4. Non-Conformance Classification
- Identify findings as:
  - Major non-conformance
  - Minor non-conformance
  - Observations
  - Recommendations

### 5. Report Generation
- Automated report creation with:
  - Audit scope and objectives
  - Questions asked and responses received
  - Findings categorized by severity
  - Recommendations and corrective actions
  - Structured output relating back to each question
  - Separate findings page with recommendations
  - Distribution versions for contractors and internal management

## Specific ISO 9001 Requirements Mentioned

### Clause 5.1 - Leadership and Commitment
- **Focus**: Top management demonstration of leadership
- **Key Areas**: Customer focus, quality policy establishment, QMS integration

### Clause 7.1.5 - Monitoring and Measuring Resources
- **Focus**: Resources for monitoring and measuring products/services
- **Key Areas**: Equipment validity, calibration processes, record maintenance

### Clause 8.5.1 - Control of Production and Service Provision
- **Focus**: Planning, implementation, and control of production/service provision
- **Key Areas**: Documented information, monitoring activities, infrastructure suitability

## Industry-Specific Considerations

### Water and Wastewater Utilities Context
- **Regulatory Framework**: Queensland Water Services Act, Drinking Water Quality standards
- **Industry Standards**: WSAA (Water Services Association of Australia) codes and guidelines
- **High-Risk Areas**:
  - Water quality monitoring and treatment processes
  - Wastewater discharge and environmental impact
  - Asset management and infrastructure integrity
  - Emergency response and business continuity

### Document Integration Capability
- Upload contractor documentation:
  - Management Plans
  - Safety documentation
  - Quality plans
  - Contract documents
- AI analysis of uploaded documents to generate tailored questions
- Industry-specific question generation based on uploaded content

## Auditing Standards Compliance
- **Primary Standard**: ISO 19011 (Guidelines for Auditing Management Systems)
- **Regional Compliance**: Australian auditing practices and industry-specific guidelines
- **Documentation**: Nationally recognized auditing standards for Australia

## Technical Implementation Requirements

### Document Processing
- PDF text extraction and analysis
- Multi-document upload capability
- Document content integration with question generation

### User Interface Features
- Simple dropdown selections for audit scope
- Conditional question display logic
- Evidence upload interface
- Progress tracking through audit process

### Reporting System
- Structured report generation
- Multiple output formats for different audiences
- Findings categorization and recommendation engine
- Action item tracking capability

## Auditor Guidance Features

### Evidence Examples (Auditor-Only)
- Hidden guidance for acceptable evidence types
- Clear distinction between visual inspection vs. formal documentation
- Industry-specific evidence examples
- Non-conformance severity determination guidance

### Simplification for Inexperienced Auditors
- Clear, concise language in questions
- Contextual guidance and definitions
- Visual aids and flowcharts
- Modular audit approach (smaller, manageable sections)
- Built-in decision trees for non-conformance classification

## Success Criteria
1. Tool must be simple enough for inexperienced auditor to follow
2. Comprehensive enough to cover multiple audit types through selection options
3. Generates industry-specific questions based on uploaded documentation
4. Produces professional reports suitable for contractor and management distribution
5. Follows recognized Australian auditing standards and practices
6. Integrates ISO 9001 requirements with contract-specific obligations