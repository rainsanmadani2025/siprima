#!/bin/bash

# ============================================================================
# DATA RECOVERY SCRIPT
# ============================================================================
# Purpose: Recover lost data after user deletion incident
# Usage: ./recover-data.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Create backup of current state
backup_current_state() {
    print_header "STEP 1: BACKING UP CURRENT STATE"

    local timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_file="db/custom.db.empty-backup-${timestamp}.db"

    if [ -f "db/custom.db" ]; then
        cp db/custom.db "$backup_file"
        print_success "Current database backed up to: $backup_file"
    else
        print_warning "No existing database file found"
    fi
}

# Run master seed script
run_master_seed() {
    print_header "STEP 2: RUNNING MASTER SEED"

    if [ -f "prisma/seed.ts" ]; then
        print_info "Running master seed script..."
        npx tsx prisma/seed.ts
        print_success "Master seed completed"
    else
        print_error "Master seed file not found: prisma/seed.ts"
        return 1
    fi
}

# Seed RPP templates
seed_rpp_templates() {
    print_header "STEP 3: SEEDING RPP TEMPLATES"

    local template_files=(
        "prisma/seed-kbc-templates.ts"
    )

    for template_file in "${template_files[@]}"; do
        if [ -f "$template_file" ]; then
            print_info "Seeding templates from: $template_file"
            npx tsx "$template_file" && print_success "Templates seeded successfully" || print_warning "Failed to seed from $template_file"
        else
            print_warning "Template file not found: $template_file"
        fi
    done
}

# Verify recovery
verify_recovery() {
    print_header "STEP 4: VERIFYING RECOVERY"

    if [ -f "check-database-state.ts" ]; then
        print_info "Checking database state..."
        npx tsx check-database-state.ts
        print_success "Recovery verification completed"
    else
        print_warning "Verification script not found"
    fi
}

# Main recovery process
main() {
    print_header "DATA RECOVERY PROCESS"
    echo ""
    print_info "This script will recover the database using seed files."
    print_warning "Make sure you have read the recovery plan document."
    echo ""

    # Ask for confirmation
    read -p "Do you want to proceed with data recovery? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_warning "Recovery cancelled by user"
        exit 0
    fi

    echo ""
    print_info "Starting recovery process..."
    echo ""

    # Execute recovery steps
    backup_current_state
    echo ""

    run_master_seed || {
        print_error "Master seed failed. Aborting recovery."
        exit 1
    }
    echo ""

    seed_rpp_templates
    echo ""

    verify_recovery
    echo ""

    print_header "RECOVERY COMPLETED"
    print_success "Data recovery process finished!"
    echo ""
    print_info "Next steps:"
    echo "  1. Verify that all users can log in"
    echo "  2. Notify teachers to recreate their PROSEM data"
    echo "  3. Implement backup system (see recovery plan)"
    echo "  4. Review and update schema to prevent future issues"
    echo ""
}

# Run main function
main "$@"
