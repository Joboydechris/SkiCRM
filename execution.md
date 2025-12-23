# SkiCRM MVP Execution Plan

This document outlines the step-by-step execution plan to build the SkiCRM MVP based on the Product Requirements Document.

## Phase 1: Foundation & Setup
- [ ] **Project Initialization**
    - [ ] Initialize React + Vite + TypeScript project
    - [ ] Configure Tailwind CSS & shadcn/ui
    - [ ] Set up directory structure (features, components, hooks, lib)
    - [ ] Install core dependencies (Zustand, React Query, React Router, Lucide Icons)
- [ ] **Supabase Setup**
    - [ ] Create Supabase project
    - [ ] Define Database Schema (Users, Contacts, Deals, Tasks, Activity Log)
    - [ ] Configure Row Level Security (RLS) policies
    - [ ] Generate TypeScript types from Supabase schema
- [ ] **Design System**
    - [ ] configure typography (Inter/Sans) and color palette (theme tokens)
    - [ ] Create base UI components (Button, Input, Card, Modal/Dialog, Dropdown)
    - [ ] Implement responsive layout shell (Sidebar/Navigation)

## Phase 2: Authentication & User Management
- [ ] **Auth Implementation**
    - [ ] Integrate Supabase Auth (Email/Password + Google OAuth)
    - [ ] Create Sign Up page
    - [ ] Create Log In page
    - [ ] Create Password Reset flow
    - [ ] Implement Protected Routes (redirect to login if unauthenticated)
- [ ] **User Settings**
    - [ ] Create Profile & Settings page
    - [ ] Implement profile update (name, email)
    - [ ] Implement password change
    - [ ] Add Dark/Light mode toggle
    - [ ] Implement account deletion

## Phase 3: Contacts Module (P0)
- [ ] **Contact Management**
    - [ ] detailed "Add Contact" modal (Name, Email, Phone, Company, Tags, Notes)
    - [ ] Implement "Edit Contact" functionality
    - [ ] Implement "Delete Contact" with confirmation
- [ ] **Contact List View**
    - [ ] Build data table/list with search & filtering
    - [ ] Implement pagination or infinite scroll
    - [ ] Add sorting (Name, Date Added, Last Activity)
- [ ] **Contact Detail View**
    - [ ] Create individual contact page
    - [ ] Show contact info, associated deals, and tasks
    - [ ] Add "Activity Timeline" (placeholder or connected to logs)

## Phase 4: Deals Module (P0)
- [ ] **Kanban Board**
    - [ ] Implement Drag-and-Drop library (dnd-kit or react-beautiful-dnd)
    - [ ] Create columns for stages: Lead, Qualified, Proposal, Closed
    - [ ] Create Deal Card component (Name, Value, Date)
    - [ ] Implement drag persistence (update stage in DB)
- [ ] **Deal Management**
    - [ ] Create "Add Deal" modal
    - [ ] Implement Edit/Delete Deal
    - [ ] Create Deal Detail view (similar to Contact Detail)
    - [ ] Link Deals to Contacts

## Phase 5: Tasks Module (P0)
- [ ] **Task List View**
    - [ ] Create grouped list view (Today, Overdue, Upcoming, Later)
    - [ ] Implement task completion toggle (checkbox)
    - [ ] Add filtering (All, Active, Completed)
- [ ] **Task Management**
    - [ ] Create Quick Add Task input
    - [ ] Create full "Add/Edit Task" modal with Due Date picker
    - [ ] Link Tasks to Contacts/Deals

## Phase 6: Dashboard & Global Search
- [ ] **Dashboard Widgets**
    - [ ] Create "Stats Overview" (Counts for Contacts, Deals, Tasks)
    - [ ] Create "Tasks Due Today" widget
    - [ ] Create "Pipeline Summary" widget
    - [ ] Create "Recent Activity" feed
- [ ] **Global Search**
    - [ ] Implement Command Palette (CMD+K)
    - [ ] search across Contacts, Deals, Tasks
    - [ ] Keyboard navigation for results

## Phase 7: Polish & Mobile Optimization
- [ ] **Mobile Responsiveness**
    - [ ] Verify mobile layout for all pages
    - [ ] Ensure touch targets are accessible (44px+)
    - [ ] Optimize Kanban for mobile scrolling
- [ ] **Data Management**
    - [ ] Implement CSV Import for Contacts
    - [ ] Implement Data Export (Contacts, Deals, Tasks to CSV)
- [ ] **UX Polish**
    - [ ] Add loading skeletons and empty states for all lists
    - [ ] Add toast notifications for success/error actions
    - [ ] extensive final QA and bug fixing

## Phase 8: Deployment & Launch
- [ ] **Production Build**
    - [ ] Run type checking and linting
    - [ ] Build optimization
- [ ] **Deployment**
    - [ ] Deploy to Vercel (or similar)
    - [ ] Configure environment variables
    - [ ] Verify Supabase production connection
