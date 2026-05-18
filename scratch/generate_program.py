import os
import re

css_to_append = """
/* =====================
   SCIENTIFIC PROGRAM SECTION
===================== */
.program-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 14px 35px;
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tab-btn.active,
.tab-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-primary);
}

.program-timeline {
  max-width: 900px;
  margin: 0 auto;
  display: none;
}

.program-timeline.active {
  display: block;
}

.timeline-item {
  background: var(--color-background);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid var(--color-accent);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.timeline-item:hover {
  background: #ffffff;
  transform: translateX(10px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.timeline-time {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timeline-title {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 8px;
  font-weight: 600;
}

.timeline-speaker {
  font-size: 0.95rem;
  color: var(--color-text);
  font-style: normal;
}

.timeline-speaker strong {
  color: var(--color-primary);
  font-weight: 600;
}

/* Program Row Alignment */
.program-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  align-items: flex-start;
}

.program-label {
  min-width: 140px;
  color: var(--color-primary);
  font-weight: 600;
  flex-shrink: 0;
  display: inline-block;
}

.program-names {
  color: var(--color-text);
}

@media (max-width: 600px) {
  .program-row {
      flex-direction: column;
  }
  .program-label {
      min-width: auto;
      margin-bottom: 2px;
  }
}
"""

style_css_path = r'd:\Personal\Dadas\spickpiku\style.css'
with open(style_css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

if '.program-tabs' not in css_content:
    with open(style_css_path, 'a', encoding='utf-8') as f:
        f.write(css_to_append)
    print("Appended CSS.")

# Script JS addition
js_to_append = """
  // ============================================================
  // PROGRAM TABS
  // ============================================================
  function initProgramTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const timelines = document.querySelectorAll('.program-timeline');

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and timelines
        tabs.forEach(t => t.classList.remove('active'));
        timelines.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding timeline
        const day = tab.getAttribute('data-day');
        const targetTimeline = document.querySelector(`.program-timeline[data-day="${day}"]`);
        if (targetTimeline) {
          targetTimeline.classList.add('active');
        }
      });
    });
  }

  // Call initProgramTabs after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgramTabs);
  } else {
    initProgramTabs();
  }
"""

script_js_path = r'd:\Personal\Dadas\spickpiku\script.js'
with open(script_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

if 'initProgramTabs' not in js_content:
    with open(script_js_path, 'a', encoding='utf-8') as f:
        f.write(js_to_append)
    print("Appended JS.")

# Program HTML Generation
html_content = """<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Program | Monsoon CME — SPICK PICU</title>
  <meta name="description"
    content="Scientific program and workshop schedule for Monsoon CME of Pediatric Intensive Care 2026.">
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <div id="nav-placeholder"></div>

  <section class="page-header">
    <div class="container">
      <h1>Scientific Program</h1>
      <div class="divider"></div>
      <p>Two days of intensive learning and training</p>
    </div>
  </section>

  <section class="section section-alt" id="program">
    <div class="container">
        <div class="program-tabs">
            <button class="tab-btn active" data-day="day1-nursing">13th June: Nursing Workshop</button>
            <button class="tab-btn" data-day="day1-ventilation">13th June: Ventilation Workshop</button>
            <button class="tab-btn" data-day="day1-procedures">13th June: Procedures in PICU</button>
            <button class="tab-btn" data-day="day1-emergencies">13th June: Emergencies</button>
            <button class="tab-btn" data-day="day2-main">14th June: Main Conference</button>
        </div>

        <!-- DAY 1: NURSING WORKSHOPS -->
        <div class="program-timeline active" data-day="day1-nursing">
            <h4 class="timeline-title" style="text-align: center; margin-bottom: 30px; font-size: 1.5rem;">Medical College, Kolkata & AIIMS, Kalyani</h4>
            
            <div class="timeline-item">
                <div class="timeline-time">08:30 - 09:00</div>
                <h4 class="timeline-title">Registration and Pre-test assessment</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:00 - 09:25</div>
                <h4 class="timeline-title">Nursing assessment of a sick child</h4>
                <div class="program-row">
                    <span class="program-label">Med College:</span>
                    <div class="program-names">Dr Mihir Sarkar</div>
                </div>
                <div class="program-row">
                    <span class="program-label">AIIMS Kalyani:</span>
                    <div class="program-names">Dr Rohit Bhowmick</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:30 - 09:45</div>
                <h4 class="timeline-title">Environmental infection control in PICU</h4>
                <div class="program-row">
                    <span class="program-label">Med College:</span>
                    <div class="program-names">Dr Sayantan Mondal</div>
                </div>
                <div class="program-row">
                    <span class="program-label">AIIMS Kalyani:</span>
                    <div class="program-names">Dr Bipul Kumar Das</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:50 - 10:10</div>
                <h4 class="timeline-title">Feeding in PICU</h4>
                <div class="program-row">
                    <span class="program-label">Med College:</span>
                    <div class="program-names">Dr Dibyendu Raychaudhuri</div>
                </div>
                <div class="program-row">
                    <span class="program-label">AIIMS Kalyani:</span>
                    <div class="program-names">Dr Niladri Sekhar Bhunia</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:10 - 10:30</div>
                <h4 class="timeline-title">CRM principles and team dynamics</h4>
                <div class="program-row">
                    <span class="program-label">Med College:</span>
                    <div class="program-names">Dr Moumita Samanta, Dr Sayantika Saha</div>
                </div>
                <div class="program-row">
                    <span class="program-label">AIIMS Kalyani:</span>
                    <div class="program-names">Dr Poonam Joshi</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:30 - 11:00</div>
                <h4 class="timeline-title">Inauguration followed by Tea Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:00 - 12:30</div>
                <h4 class="timeline-title">Workstations (Rotations)</h4>
                <p class="timeline-speaker"><strong>Station 1:</strong> General NURSING care of a sick child and bundle care<br>
                <strong>Station 2:</strong> Preparing for RSI, Getting it Right<br>
                <strong>Station 3:</strong> Nursing care plan of a ventilated child with sedation scale and DOPE</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">12:30 - 13:00</div>
                <h4 class="timeline-title">PALS 2025 and QCPR Game</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:00 - 13:30</div>
                <h4 class="timeline-title">Lunch Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:30 - 14:00</div>
                <h4 class="timeline-title">Ethical Issues in PICU Care</h4>
                <div class="program-row">
                    <span class="program-label">Med College:</span>
                    <div class="program-names">Dr Mihir Sarkar</div>
                </div>
                <div class="program-row">
                    <span class="program-label">AIIMS Kalyani:</span>
                    <div class="program-names">Dr Rohit Bhowmick</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:00 - 14:15</div>
                <h4 class="timeline-title">ISBAR handover</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:15 - 14:40</div>
                <h4 class="timeline-title">Nursing care plan of a child with raised intracranial tension</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:40 - 15:00</div>
                <h4 class="timeline-title">Nursing preparation for transport of a sick child</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">15:00 - 16:30</div>
                <h4 class="timeline-title">Workstations (Rotations)</h4>
                <p class="timeline-speaker"><strong>Station 4:</strong> Respiratory Care (Airway, Oxygen, Nebulization, Ventilator set-up)<br>
                <strong>Station 5:</strong> Cardiovascular/Hemodynamic care (BP, A line, Care of lines)<br>
                <strong>Station 6:</strong> Neurological care, CPR, Crash cart, Defibrillator</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:30 - 17:00</div>
                <h4 class="timeline-title">Concluding Remarks, Post test, Certificate Distribution</h4>
            </div>
        </div>

        <!-- DAY 1: VENTILATION WORKSHOPS -->
        <div class="program-timeline" data-day="day1-ventilation">
            <h4 class="timeline-title" style="text-align: center; margin-bottom: 30px; font-size: 1.5rem;">AIIMS Kalyani, Manipal Hospitals, Apollo Multispeciality</h4>

            <div class="timeline-item">
                <div class="timeline-time">09:00 - 09:30</div>
                <h4 class="timeline-title">Registration & Breakfast</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:30 - 10:00</div>
                <h4 class="timeline-title">Respiratory Physiology</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:00 - 10:30</div>
                <h4 class="timeline-title">Ventilator Modes: Basic</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:30 - 11:00</div>
                <h4 class="timeline-title">Ventilator Modes: Advanced</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:00 - 11:30</div>
                <h4 class="timeline-title">Ventilator Graphics</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:30 - 12:10</div>
                <h4 class="timeline-title">Cardiopulmonary Interaction</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">12:10 - 12:50</div>
                <h4 class="timeline-title">Ventilator Associated Events (VILI / VAP)</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">12:50 - 13:10</div>
                <h4 class="timeline-title">Weaning and Extubation</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:10 - 13:45</div>
                <h4 class="timeline-title">Lunch Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:45 - 15:45</div>
                <h4 class="timeline-title">Section 1 Rotations (40 Minutes per Station)</h4>
                <p class="timeline-speaker"><strong>Station 1:</strong> Ventilation modes (Basic and Advanced)<br>
                <strong>Station 2:</strong> Humidification / Nebulisation / Suctioning<br>
                <strong>Station 3:</strong> Non-Invasive Ventilation (NIV) / Proning</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">15:45 - 16:45</div>
                <h4 class="timeline-title">Section 2 Rotations (20 Minutes per Station)</h4>
                <p class="timeline-speaker"><strong>Station 4:</strong> Disease Specific Ventilation - ARDS<br>
                <strong>Station 5:</strong> Disease Specific Ventilation - Asthma<br>
                <strong>Station 6:</strong> Disease Specific Ventilation - Cardiac & Neuro</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:45 - 17:15</div>
                <h4 class="timeline-title">Ethical Issues & Closing Session</h4>
                <p class="timeline-speaker">Q&A, Valedictory, Certificate Distribution</p>
            </div>
        </div>

        <!-- DAY 1: PROCEDURES IN PICU -->
        <div class="program-timeline" data-day="day1-procedures">
            <h4 class="timeline-title" style="text-align: center; margin-bottom: 30px; font-size: 1.5rem;">Neotia Women & Child Care Centre, Newtown</h4>

            <div class="timeline-item">
                <div class="timeline-time">09:00 - 09:30</div>
                <h4 class="timeline-title">Registration & Breakfast</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:30 - 09:45</div>
                <h4 class="timeline-title">Pre procedure checklist & Waste disposal</h4>
                <div class="program-row">
                    <span class="program-label">Faculty:</span>
                    <div class="program-names">Dr Bijay Meher</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:45 - 10:00</div>
                <h4 class="timeline-title">Asepsis – Current guidelines</h4>
                <div class="program-row">
                    <span class="program-label">Faculty:</span>
                    <div class="program-names">Dr Somenath Gorain</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:00 - 10:30</div>
                <h4 class="timeline-title">Ethical aspects in PICU procedure</h4>
                <div class="program-row">
                    <span class="program-label">Faculty:</span>
                    <div class="program-names">Dr Shubhadeep Das</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:30 - 13:10</div>
                <h4 class="timeline-title">Workstation 1 (40 mins rotation each)</h4>
                <p class="timeline-speaker">
                <strong>10:30:</strong> Basic Airway Management<br>
                <strong>11:10:</strong> Difficult Airway Management<br>
                <strong>11:50:</strong> Intercostal drain Needle decompression<br>
                <strong>12:30:</strong> PD Catheter insertion</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:10 - 14:00</div>
                <h4 class="timeline-title">Inauguration & Lunch Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:00 - 16:40</div>
                <h4 class="timeline-title">Workstation 2 (40 mins rotation each)</h4>
                <p class="timeline-speaker">
                <strong>14:00:</strong> USG guided Central venous line & Arterial line insertion<br>
                <strong>14:40:</strong> PICC & IO line placement<br>
                <strong>15:20:</strong> Bronchoscopy<br>
                <strong>16:00:</strong> Bedside ECHO in PICU</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:40 - 17:00</div>
                <h4 class="timeline-title">Valedictory</h4>
            </div>
        </div>

        <!-- DAY 1: EMERGENCIES -->
        <div class="program-timeline" data-day="day1-emergencies">
            <h4 class="timeline-title" style="text-align: center; margin-bottom: 30px; font-size: 1.5rem;">Calcutta National Medical College, Kolkata</h4>

            <div class="timeline-item">
                <div class="timeline-time">08:30 - 09:00</div>
                <h4 class="timeline-title">Registration & Breakfast</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:00 - 11:10</div>
                <h4 class="timeline-title">Morning Sessions</h4>
                <p class="timeline-speaker">
                Approach to a sick child<br>
                ENT emergencies in children<br>
                Pediatric surgical emergencies in office practice<br>
                CNS emergencies and management of raised ICT<br>
                CVS emergencies and management of shock</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:10 - 11:20</div>
                <h4 class="timeline-title">Tea Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:20 - 14:10</div>
                <h4 class="timeline-title">Mid-Day Sessions</h4>
                <p class="timeline-speaker">
                Pediatric Renal emergencies<br>
                Respiratory emergencies<br>
                GI emergencies<br>
                Initial stabilisation of Trauma patients<br>
                Approach to a child with poisoning<br>
                Scorpion sting & Snake bite</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:10 - 14:40</div>
                <h4 class="timeline-title">Lunch Break</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:40 - 16:40</div>
                <h4 class="timeline-title">Workstations (40 mins each)</h4>
                <p class="timeline-speaker">Basic Life Support<br>Advance Life Support<br>Airway, breathing devices and emergency drugs</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:40 - 17:00</div>
                <h4 class="timeline-title">Feedback and certificate distribution</h4>
            </div>
        </div>

        <!-- DAY 2: MAIN CONFERENCE -->
        <div class="program-timeline" data-day="day2-main">
            <h4 class="timeline-title" style="text-align: center; margin-bottom: 30px; font-size: 1.5rem;">The Park, Kolkata</h4>

            <div class="timeline-item">
                <div class="timeline-time">08:00 - 08:30</div>
                <h4 class="timeline-title">Registration and Breakfast</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">08:30 - 09:30</div>
                <h4 class="timeline-title">Selected Oral Presentations (6 Papers x 10 Minutes)</h4>
                <div class="program-row">
                    <span class="program-label">Judges:</span>
                    <div class="program-names">Dr Supratim Dutta, Dr Jaydeb Ray, Dr Dibyendu Raychaudhuri, Dr Mukesh Kumar Jain, Dr Bipul Kumar Das, Dr Bijay Kumar Meher</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">09:31 - 10:28</div>
                <h4 class="timeline-title">Theme 1: Respiratory System</h4>
                <p class="timeline-speaker"><strong>09:31:</strong> Prone Without Tubes: Awake Proning in Children<br>
                <strong>09:42:</strong> Driving Pressure & VILI: Are We Ventilating Safely?<br>
                <strong>09:53:</strong> Panel Discussion: PICU Liberation</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">10:29 - 11:23</div>
                <h4 class="timeline-title">Theme 2: CVS, Hemodynamics & PICU Quality</h4>
                <p class="timeline-speaker"><strong>10:29:</strong> Balanced Salt Solutions (BSS): Where Do We Stand?<br>
                <strong>10:40:</strong> Pediatric Septic Cardiomyopathy: Beyond the Ejection Fraction<br>
                <strong>10:51:</strong> ECMO Timing Dilemma: Too Early vs. Too Late<br>
                <strong>11:02:</strong> The Fluid Overload Tipping Point: When to Pull the Trigger on CRRT<br>
                <strong>11:13:</strong> Quality Indicators in PICU: Beyond Mortality</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">11:24 - 11:59</div>
                <h4 class="timeline-title">Theme 3: Sepsis and Septic Shock</h4>
                <div class="program-row">
                    <span class="program-label">Panel Discussion:</span>
                    <div class="program-names">Surviving Sepsis Campaign Updates</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">12:00 - 12:43</div>
                <h4 class="timeline-title">Sponsored Pre-Lunch Partnership Sessions</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">12:43 - 13:29</div>
                <h4 class="timeline-title">LUNCH BREAK</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:30 - 13:50</div>
                <h4 class="timeline-title">Theme 4: Immunology & Novel Therapies</h4>
                <p class="timeline-speaker">Precision Management in Pediatric Sepsis: Biomarkers and Therapies</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">13:51 - 14:11</div>
                <h4 class="timeline-title">Theme 5: Hematology & Coagulopathy</h4>
                <p class="timeline-speaker">Paradigm Change in Management of Coagulopathy & Anticoagulation</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:12 - 14:44</div>
                <h4 class="timeline-title">Theme 6: Neurology, Nutrition & AI</h4>
                <p class="timeline-speaker">Nutrition: Metabolic Crises in the PICU<br>
                Feasibility of Continuous EEG Monitoring in Neurocritical Care<br>
                Predict Before It Happens: Can AI Detect Deterioration Early?</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">14:45 - 15:20</div>
                <h4 class="timeline-title">Theme 7: Infection and AMR</h4>
                <div class="program-row">
                    <span class="program-label">Panel Discussion:</span>
                    <div class="program-names">AMR & MDR Bedside Strategies & Stewardship</div>
                </div>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">15:21 - 16:12</div>
                <h4 class="timeline-title">Theme 8: Ethical and Legal Issues</h4>
                <p class="timeline-speaker"><strong>15:21:</strong> The Art of Communication in PICU: Shared Decision Making<br>
                <strong>15:37:</strong> Panel Discussion: Ethics in the PICU</p>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:13 - 16:53</div>
                <h4 class="timeline-title">Quiz</h4>
            </div>

            <div class="timeline-item">
                <div class="timeline-time">16:54 - 17:30</div>
                <h4 class="timeline-title">Valedictory, Prize Distribution & Group Photo</h4>
            </div>

        </div>

    </div>
  </section>

  <div id="footer-placeholder"></div>
  <button class="back-to-top" aria-label="Back to top">↑</button>
  <script src="script.js"></script>
</body>

</html>
"""

program_html_path = r'd:\Personal\Dadas\spickpiku\program.html'
with open(program_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Updated program.html")

