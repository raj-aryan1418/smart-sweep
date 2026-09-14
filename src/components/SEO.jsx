import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_SEO = {
  '/': {
    title: 'SmartSweep - Municipal Solid Waste Management & Sanitation Platform',
    description: 'Smart municipal solid waste management platform. Report public garbage hotspots with GPS, book doorstep bulk waste pickup, and track live cleanup status.'
  },
  '/login': {
    title: 'Portal Sign In - SmartSweep Citizen, Crew & Admin Access',
    description: 'Sign in to SmartSweep dedicated portals for Citizens, Sanitation Field Crew Drivers, and Municipal Supervisors.'
  },
  '/register': {
    title: 'Create Account - SmartSweep Municipal Waste Platform',
    description: 'Register for SmartSweep to file municipal complaints, book bulk waste pickups, or join field sanitation operations.'
  },
  '/citizen/dashboard': {
    title: 'Citizen Dashboard - SmartSweep Resident Cleanliness Hub',
    description: 'Track your filed waste complaints, monitor cleanup progress, view ward garbage timetables, and book bulk waste collection.'
  },
  '/crew/dashboard': {
    title: 'Crew Operations Hub - SmartSweep Field Driver Task Queue',
    description: 'Real-time sanitation crew queue, sector hotspot navigation, status updates, and waste removal photo verification.'
  },
  '/crew': {
    title: 'Crew Operations Hub - SmartSweep Field Driver Task Queue',
    description: 'Real-time sanitation crew queue, sector hotspot navigation, status updates, and waste removal photo verification.'
  },
  '/admin/dashboard': {
    title: 'Supervisor Command Center - SmartSweep Municipal Oversight',
    description: 'Executive citywide municipal command center with real-time KPI metrics, active fleet telematics, and rapid crew dispatch.'
  },
  '/dashboard': {
    title: 'Supervisor Command Center - SmartSweep Municipal Oversight',
    description: 'Executive citywide municipal command center with real-time KPI metrics, active fleet telematics, and rapid crew dispatch.'
  },
  '/report': {
    title: 'Report Garbage Hotspot - SmartSweep GPS Issue Filing',
    description: 'Report municipal waste accumulation, overflowing bins, or hazardous dumping with instant GPS auto-detection and camera proof.'
  },
  '/my-complaints': {
    title: 'My Filed Complaints - SmartSweep Caseload Tracker',
    description: 'View and manage your filed municipal waste complaints with live status updates, assigned crew details, and resolution proofs.'
  },
  '/bulk-pickup': {
    title: 'Book Bulk Waste Pickup - SmartSweep Doorstep Debris Collection',
    description: 'Schedule doorstep municipal collection for heavy furniture, construction debris, electronics, and bulky recyclables.'
  },
  '/bulk-pickup-manage': {
    title: 'Bulk Waste Dispatch Management - SmartSweep Heavy Operations',
    description: 'Manage heavy hydraulic compactor dispatches, schedule bulk collections, and allocate specialized vehicles.'
  },
  '/schedule': {
    title: 'Ward Waste Collection Timetable & Segregation Calendar - SmartSweep',
    description: 'Check daily wet, dry, and hazardous waste collection timings, door-to-door schedule, and municipal holiday notices for your ward.'
  },
  '/feed': {
    title: 'Public Sanitation Feed - SmartSweep Community Transparency Stream',
    description: 'Live community stream of verified cleanups, before-and-after photo proofs, citizen ratings, and sanitation achievements.'
  },
  '/reports': {
    title: 'Municipal Analytics & SLA Reports - SmartSweep Data Portal',
    description: 'Deep-dive sanitation analytics, ward SLA leaderboard, hazard distribution charts, and municipal performance metrics.'
  },
  '/workforce': {
    title: 'Sanitation Workforce Roster & PPE Safety Inventory - SmartSweep',
    description: 'Manage municipal sanitation staff, safety compliance scorecards, and personal protective equipment (PPE) inventory.'
  },
  '/vehicles': {
    title: 'Fleet Vehicles & Compactor Telematics - SmartSweep Fleet Tracker',
    description: 'Live municipal vehicle fleet tracking, hydraulic compactors, electric mini tippers, and telemetry gauges.'
  }
};

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    // Find matching route or fallback
    let currentSEO = ROUTE_SEO[location.pathname];
    
    if (!currentSEO && location.pathname.startsWith('/complaint/')) {
      currentSEO = {
        title: 'Complaint Timeline & Case Details - SmartSweep',
        description: 'Track municipal waste complaint resolution progress, crew details, before/after evidence photos, and citizen feedback.'
      };
    }

    if (!currentSEO) {
      currentSEO = ROUTE_SEO['/'];
    }

    // Update Document Title
    document.title = currentSEO.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentSEO.description);

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', currentSEO.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', currentSEO.description);

    // Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    }
  }, [location.pathname]);

  return null;
}
