#!/bin/bash

# InsulationPal Database Setup Script
# This script sets up the complete database schema for InsulationPal

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database connection details
# Update these with your Supabase project details
DB_URL="${DATABASE_URL:-postgresql://postgres:(84Lo)P@#nHYT5$3gTg@db.nacaxeklijillnrvdeah.supabase.co:5432/postgres}"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if psql is available
check_psql() {
    if ! command -v psql &> /dev/null; then
        print_error "psql command not found. Please install PostgreSQL client."
        echo ""
        echo "Installation instructions:"
        echo "  Windows: winget install PostgreSQL.PostgreSQL"
        echo "  macOS:   brew install postgresql"
        echo "  Ubuntu:  sudo apt-get install postgresql-client"
        exit 1
    fi
}

# Function to check database connection
check_connection() {
    print_status "Testing database connection..."
    
    if psql "$DB_URL" -c "SELECT 1;" &> /dev/null; then
        print_success "Database connection successful"
    else
        print_error "Cannot connect to database. Please check your connection string."
        echo ""
        echo "Make sure to update the DB_URL in this script with your actual:"
        echo "  - Password"
        echo "  - Project reference ID"
        echo ""
        echo "You can find these in your Supabase dashboard:"
        echo "  Settings > Database > Connection string"
        exit 1
    fi
}

# Function to run SQL file
run_sql_file() {
    local file_path=$1
    local description=$2
    
    if [ ! -f "$file_path" ]; then
        print_error "File not found: $file_path"
        exit 1
    fi
    
    print_status "Running: $description"
    echo "File: $file_path"
    
    if psql "$DB_URL" -f "$file_path" > /dev/null 2>&1; then
        print_success "$description completed successfully"
    else
        print_error "$description failed"
        echo ""
        echo "Running with verbose output to show error:"
        psql "$DB_URL" -f "$file_path"
        exit 1
    fi
    
    echo ""
}

# Function to verify setup
verify_setup() {
    print_status "Verifying database setup..."
    
    # Check if main tables exist
    local tables=("users" "contractors" "leads" "lead_assignments" "reviews")
    
    for table in "${tables[@]}"; do
        if psql "$DB_URL" -c "SELECT 1 FROM $table LIMIT 1;" &> /dev/null; then
            print_success "Table '$table' exists and accessible"
        else
            print_warning "Table '$table' may not exist or is not accessible"
        fi
    done
    
    # Check sample data
    local contractor_count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM contractors;" 2>/dev/null | xargs)
    if [ "$contractor_count" -gt 0 ]; then
        print_success "Sample data loaded: $contractor_count contractors found"
    else
        print_warning "No sample contractors found (this is OK if you skipped sample data)"
    fi
}

# Main execution
main() {
    echo "=================================================="
    echo "  InsulationPal Database Setup"
    echo "=================================================="
    echo ""
    
    # Preliminary checks
    check_psql
    
    # Check if DB_URL is still the default template
    if [[ "$DB_URL" == *"[YOUR-PASSWORD]"* ]] || [[ "$DB_URL" == *"[YOUR-REF]"* ]]; then
        print_error "Please update the DB_URL variable with your actual Supabase connection details."
        echo ""
        echo "Edit this script and replace:"
        echo "  [YOUR-PASSWORD] with your actual database password"
        echo "  [YOUR-REF] with your actual project reference ID"
        echo ""
        echo "You can find these in: Supabase Dashboard > Settings > Database"
        exit 1
    fi
    
    check_connection
    
    echo ""
    print_status "Starting database setup process..."
    echo ""
    
    # Run database files in order
    run_sql_file "database/01-main-schema.sql" "Main schema (tables, indexes, types)"
    run_sql_file "database/02-rls-policies.sql" "Row Level Security policies"
    run_sql_file "database/03-functions-triggers.sql" "Functions and triggers"
    
    # Ask about sample data
    echo ""
    read -p "Do you want to install sample data? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_sql_file "database/04-sample-data.sql" "Sample data (test contractors and leads)"
    else
        print_status "Skipping sample data installation"
    fi
    
    echo ""
    verify_setup
    
    echo ""
    echo "=================================================="
    print_success "Database setup completed successfully!"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo "  1. Update your .env.local with Supabase credentials"
    echo "  2. Test the connection in your Next.js app"
    echo "  3. Start building your application features"
    echo ""
    echo "Useful commands:"
    echo "  npm run dev              # Start development server"
    echo "  npm install @supabase/supabase-js  # Install Supabase client"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "InsulationPal Database Setup Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --verify       Only verify existing setup"
        echo "  --force        Skip confirmation prompts"
        echo ""
        echo "Before running:"
        echo "  1. Update DB_URL with your Supabase connection string"
        echo "  2. Ensure psql is installed"
        echo "  3. Make sure your Supabase project is active"
        exit 0
        ;;
    --verify)
        check_psql
        check_connection
        verify_setup
        exit 0
        ;;
    --force)
        export FORCE_YES=1
        main
        ;;
    *)
        main
        ;;
esac
