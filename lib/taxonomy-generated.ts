// AUTO-GENERATED from data/bridgely_taxonomy_template.xlsx by scripts/import-taxonomy.mjs
// Do not edit by hand — edit the spreadsheet and re-run: npm run taxonomy:import
import type { NormEntry } from "./mock-data";

export const generatedTaxonomy: NormEntry[] = [
  {
    "normId": "WP-1-indirect-refusal-workplace",
    "category": "Workplace",
    "definition": "British colleagues rarely say a direct no to a request from a peer or senior; refusal is signaled through hedged language instead.",
    "surfaceMarkers": "\"I'll think about it\" / \"let me get back to you\" / \"I'll keep it in mind\" + changing the subject or deferring to another conversation",
    "whatItMeans": "Likely a soft no, or at minimum \"not convinced yet\" — not genuine active consideration.",
    "example": "A client proposed an idea to their team lead, who replied \"that's interesting, let me think about it and get back to you after I've spoken to the client.\" Client took this as agreement.",
    "goodResponse": "Ask a direct follow-up with a specific choice: \"Should I hold off, or keep developing it?\" rather than assuming agreement.",
    "status": "Approved"
  },
  {
    "normId": "WP-2-promotion-discussion-indirectness",
    "category": "Workplace",
    "definition": "Career progression conversations are rarely given a firm yes/no in the moment; managers tend to defer to a future review cycle.",
    "surfaceMarkers": "\"Let's revisit this at your next review\" / \"it's definitely something we can look at\" with no committed timeline",
    "whatItMeans": "Not a promise — it's a deferral. A real commitment usually comes with a specific date or documented next step, not just warm language.",
    "example": "A client asked about promotion and was told \"it's something we can definitely look at,\" and took it as a near-term commitment. Nothing was scheduled.",
    "goodResponse": "Ask for something concrete: \"Could we set a specific date to revisit this, and what would you want to see from me before then?\"",
    "status": "Draft"
  },
  {
    "normId": "WP-3-formal-warning-procedural-tone",
    "category": "Workplace",
    "definition": "Formal HR processes (warnings, performance notices) use flat, procedural, legalistic language — this is standard process, not a sign of personal hostility.",
    "surfaceMarkers": "Formal letter/email format, phrases like \"in accordance with company policy,\" no informal or apologetic tone",
    "whatItMeans": "The coldness is procedural convention, not an indicator of how serious the situation is or how the manager personally feels.",
    "example": "A client received a written warning email in very formal language and assumed their manager was furious with them personally.",
    "goodResponse": "Separate the tone from the content — read the specific facts/actions stated, and ask HR or the manager directly what the practical next steps are.",
    "status": "Draft"
  },
  {
    "normId": "WP-4-deadline-reminder-escalation",
    "category": "Workplace",
    "definition": "Deadline reminders start polite and indirect, then escalate in firmness with repetition — the politeness doesn't mean the urgency is low.",
    "surfaceMarkers": "\"Just a gentle reminder\" (1st ask) → \"following up again on this\" (2nd) → \"I need this by end of day\" (3rd, now direct)",
    "whatItMeans": "Each repeated \"gentle\" reminder signals rising urgency, even though the wording stays polite — treat repetition itself as the real signal.",
    "example": "A client kept receiving \"just a gentle reminder\" emails and didn't realize the third one meant their manager was now seriously concerned.",
    "goodResponse": "Treat any second follow-up on the same task as a priority signal, regardless of how mild the wording still sounds.",
    "status": "Draft"
  },
  {
    "normId": "WP-5-team-ritual-participation",
    "category": "Workplace",
    "definition": "Small recurring team rituals (tea rounds, birthday collections, Friday drinks) function as belonging signals; opting out repeatedly can be read as disengagement even if unintended.",
    "surfaceMarkers": "Being asked \"are you coming to...\" repeatedly, or noticing colleagues stop including you in casual invites",
    "whatItMeans": "Declining once is neutral; declining consistently can quietly affect how included/trusted a colleague is seen to be, separate from work performance.",
    "example": "A client always skipped Friday team drinks for religious/personal reasons and later felt excluded from casual work decisions, without realizing the two were connected.",
    "goodResponse": "Participate selectively where possible, or briefly explain the reason once so it reads as a boundary rather than disinterest.",
    "status": "Draft"
  },
  {
    "normId": "HC-1-gp-appointment-brevity",
    "category": "Healthcare",
    "definition": "GPs are brief and businesslike due to strict time slots (often 10 minutes); this is standard practice, not rudeness or disinterest.",
    "surfaceMarkers": "Doctor asks few questions, gives short direct answers, ends the appointment quickly",
    "whatItMeans": "The GP is following time constraints, not dismissing the patient's concern.",
    "example": "A client felt their GP \"didn't take them seriously\" because the appointment lasted only 8 minutes and the doctor gave a brief answer.",
    "goodResponse": "Prepare 2-3 clear points before the appointment, and ask directly for a follow-up if more time is needed: \"Could we book a longer appointment to go through this properly?\"",
    "status": "Approved"
  },
  {
    "normId": "HC-2-referral-wait-silence",
    "category": "Healthcare",
    "definition": "A referral to a specialist is often followed by a long silence rather than active updates — no news is normal, not a sign of being forgotten.",
    "surfaceMarkers": "\"We'll be in touch once it's been reviewed\" with no timeline, followed by weeks of no contact",
    "whatItMeans": "This reflects NHS process/backlog, not that the case was dropped or deprioritized.",
    "example": "A client waited six weeks after a GP referral with no contact and assumed the request had been lost.",
    "goodResponse": "Call the GP surgery or hospital referral line directly to check status rather than assuming; this is normal and expected, not rude to ask.",
    "status": "Draft"
  },
  {
    "normId": "HL-1-landlord-vague-commitment",
    "category": "Housing & landlord",
    "definition": "Landlords often respond to repair requests with non-committal language rather than a firm yes or no.",
    "surfaceMarkers": "\"I'll see what I can do\" / \"I'll look into it\" with no timeframe given",
    "whatItMeans": "Often means low priority unless followed up — not necessarily a refusal, but not a commitment either.",
    "example": "A client asked their landlord to fix the heating; landlord replied \"I'll see what I can do about it.\" Two weeks passed with no action.",
    "goodResponse": "Follow up in writing with a specific ask: \"Could you give me a rough date for the repair? It's been two weeks.\"",
    "status": "Approved"
  },
  {
    "normId": "HL-2-passive-aggressive-written-notice",
    "category": "Housing & landlord",
    "definition": "Complaints about noise, cleanliness, or shared spaces are often delivered as overly polite written notes rather than direct confrontation.",
    "surfaceMarkers": "Notes/texts starting with \"just a friendly reminder\" or \"hope you don't mind me asking\" about a repeated issue",
    "whatItMeans": "The politeness is a social buffer — the underlying message is a firm complaint, not a casual suggestion.",
    "example": "A client received a \"friendly note\" about bin day from a neighbor and didn't realize it was actually a repeated complaint.",
    "goodResponse": "Treat the specific ask as the real message regardless of the soft wording, and respond to the practical issue directly.",
    "status": "Draft"
  },
  {
    "normId": "JS-1-vague-interview-feedback",
    "category": "Job search",
    "definition": "UK employers rarely give a direct rejection after an interview; silence or vague language is the common signal.",
    "surfaceMarkers": "\"We'll be in touch\" with no specific timeline, or no response after the stated decision date",
    "whatItMeans": "Usually means the application was unsuccessful, especially past the stated timeline.",
    "example": "A client was told \"we'll let you know either way\" after a final-round interview, then heard nothing for three weeks.",
    "goodResponse": "Send one polite follow-up after the stated timeline passes, then treat continued silence as a likely no and keep applying elsewhere.",
    "status": "Approved"
  },
  {
    "normId": "JS-2-salary-negotiation-indirectness",
    "category": "Job search",
    "definition": "UK job offers often avoid stating a number first and expect the candidate to respond to a range rather than name a figure outright.",
    "surfaceMarkers": "\"What's your expected salary range?\" asked before any number is offered",
    "whatItMeans": "This is a negotiation norm, not evasiveness — giving a well-researched range in response is expected and normal, not pushy.",
    "example": "A client felt uncomfortable being asked their expectation first and gave a vague non-answer, which read as unprepared.",
    "goodResponse": "Research the market range beforehand and state a confident range when asked, rather than deflecting the question.",
    "status": "Draft"
  },
  {
    "normId": "WP-6-agreement-in-meetings-silence",
    "category": "Workplace",
    "definition": "In meetings, silence or a brief “sure, sounds good” from colleagues doesn't necessarily mean genuine agreement — open disagreement in a group setting is often avoided in favor of raising concerns privately afterward.",
    "surfaceMarkers": "Nodding, “yeah, that could work,” no pushback in the room, but a colleague pulls you aside later or emails a “quick thought” afterwards.",
    "whatItMeans": "Real objections are often saved for a private, one-on-one follow-up rather than voiced in front of the group — the meeting-room agreement can be provisional, not final.",
    "example": "A client presented a plan in a team meeting; everyone nodded along. Two days later, a colleague emailed several concerns that were never raised in the room.",
    "goodResponse": "After a meeting where a decision was made, follow up individually with key people: “Any concerns before I move ahead with this?” — invites private pushback before it's too late to change course.",
    "status": "Draft"
  },
  {
    "normId": "WP-7-cc-escalation-email",
    "category": "Workplace",
    "definition": "Being copied (CC'd) into an email thread you weren't previously part of, especially involving a manager, is a subtle signal that something has become a formal concern.",
    "surfaceMarkers": "A sudden CC to a manager or HR on a routine email chain, with no explanation of why they were added.",
    "whatItMeans": "This often marks the point an issue is being formally tracked or escalated, even though the email's tone may stay friendly and unchanged.",
    "example": "A client's routine project email suddenly included their manager in CC with no comment; they didn't realize this meant the sender wanted it on record.",
    "goodResponse": "When newly CC'd people appear, ask plainly: “Just flagging — is there a concern here I should be addressing directly?”",
    "status": "Draft"
  },
  {
    "normId": "WP-8-sorry-to-bother-request",
    "category": "Workplace",
    "definition": "“Sorry to bother you, but...” at the start of a request is a politeness convention, not a sign the request is a minor imposition or something to be brushed off.",
    "surfaceMarkers": "“Sorry to bother you,” “this is probably nothing, but,” “just a quick one” before what turns out to be a substantial ask.",
    "whatItMeans": "The apology softens the tone of the request but doesn't reflect its actual size or urgency — take the request itself at face value, not the apology.",
    "example": "A client's manager opened with “sorry to bother you, probably nothing” before asking for a full report rewritten by end of day; the client assumed it was low priority and delayed.",
    "goodResponse": "Treat the substance of the ask, not the softening language, as the real signal of urgency and size.",
    "status": "Draft"
  },
  {
    "normId": "WP-9-open-door-policy-literal",
    "category": "Workplace",
    "definition": "An “open door policy” is a genuine invitation to raise issues, but going to a manager's desk unannounced is still often expected to be brief and scheduled where possible, not a literal drop-in at any time.",
    "surfaceMarkers": "“My door's always open” stated once at onboarding, but calendar-blocked time or a quick Slack “got a sec?” is the actual norm for anything beyond a 2-minute question.",
    "whatItMeans": "The offer is sincere, but the practical expectation is still to signal first for anything substantial — treating it as a literal any-time invitation can read as inconsiderate of their time.",
    "example": "A client took “my door is always open” literally and would walk in mid-task with lengthy questions, and noticed her manager becoming visibly less receptive over time without saying why.",
    "goodResponse": "For anything beyond a quick yes/no, send a short message first: “Have a sec today for a 10-minute chat about X?”",
    "status": "Draft"
  },
  {
    "normId": "WP-10-feedback-sandwich",
    "category": "Workplace",
    "definition": "Constructive criticism is frequently delivered wrapped between two positive comments, and the negative point can be easy to miss if it's not clearly flagged.",
    "surfaceMarkers": "“Really strong work on X, one thing to think about is Y, and Z was great too” — the critical point sits in the middle, minimized in length compared to the praise around it.",
    "whatItMeans": "The middle comment is often the actual, most important point of the feedback — proportionally small wording doesn't mean proportionally small importance.",
    "example": "A client's manager said “great presentation, maybe tighten the data section next time, but overall well done” — the client only registered the praise and repeated the same issue the following week.",
    "goodResponse": "When feedback includes a “middle” point, repeat it back to confirm: “So the main thing to work on is the data section — got it.”",
    "status": "Draft"
  },
  {
    "normId": "HC-3-nhs-111-triage-language",
    "category": "Healthcare",
    "definition": "NHS 111 phone/online triage uses cautious, worst-case-inclusive language by design; being told to “go to A&E if it gets worse” isn't a sign your case is being taken as urgent right now, it's a standard safety-net instruction.",
    "surfaceMarkers": "“If you experience X, Y, or Z, go to A&E immediately” listed at the end of an otherwise calm, non-urgent-sounding call or web triage result.",
    "whatItMeans": "This is defensive, standardized safety language given to nearly everyone, not a specific escalation of concern about your individual case.",
    "example": "A client called 111 about a minor issue and was told a long list of “go to A&E if...” symptoms; they panicked, assuming their case was more serious than the calm tone of the rest of the call suggested.",
    "goodResponse": "Ask directly: “Based on what I've told you, how urgent is this specifically?” rather than reading the standard safety list as a signal.",
    "status": "Draft"
  },
  {
    "normId": "HC-4-pharmacist-first-point-of-contact",
    "category": "Healthcare",
    "definition": "Pharmacists are a legitimate and commonly used first point of contact for minor ailments in the UK, not a lesser substitute for seeing a GP.",
    "surfaceMarkers": "Being told “have a chat with the pharmacist” by a GP receptionist, or a pharmacy consultation room used for private symptom discussions.",
    "whatItMeans": "This is a standard, expected referral for minor issues (rashes, coughs, UTIs, etc.), not the surgery deflecting or downgrading the concern.",
    "example": "A client felt dismissed when a GP receptionist suggested the pharmacist instead of booking a GP appointment for a minor skin issue, not realizing this is the normal, expected first step.",
    "goodResponse": "Treat a pharmacist referral as a genuine, appropriate option — and if symptoms persist after, that's the natural point to request a GP appointment.",
    "status": "Draft"
  },
  {
    "normId": "HC-5-patient-advocating-for-self",
    "category": "Healthcare",
    "definition": "Patients are generally expected to actively state their own priorities and ask direct questions in appointments — deference to the doctor's judgement without input can result in your specific concern going unaddressed.",
    "surfaceMarkers": "A GP asking “anything else?” briefly at the end of a short appointment, with no further prompting for detail.",
    "whatItMeans": "The system expects the patient to raise what matters to them proactively; staying quiet out of politeness or deference is read as “nothing else,” not as holding back out of respect.",
    "example": "A client had a second, more concerning symptom they didn't mention because the doctor “seemed busy,” and the appointment ended without it ever being raised.",
    "goodResponse": "Prepare your 1-2 main points beforehand and state them directly and early: “There are two things I want to cover today: X and Y.”",
    "status": "Draft"
  },
  {
    "normId": "HC-6-cancellation-text-formality",
    "category": "Healthcare",
    "definition": "A short, impersonal-seeming NHS text or letter cancelling or rescheduling an appointment is standard administrative process, not a sign the appointment or your case is being deprioritized.",
    "surfaceMarkers": "A terse automated text: “Your appointment on [date] has been cancelled. Please call to rebook.” with no explanation or apology.",
    "whatItMeans": "This reflects a standardized admin system, not a judgement about how important your case is — cancellations happen routinely for capacity reasons.",
    "example": "A client received a blunt cancellation text with no explanation and assumed their case had been deprioritized or lost; it had simply been rebooked due to a scheduling clash.",
    "goodResponse": "Call to rebook and ask plainly if there's a reason for the change or an expected new timeframe, rather than assuming a downgrade in priority.",
    "status": "Draft"
  },
  {
    "normId": "HC-7-mental-health-checkin-brevity",
    "category": "Healthcare",
    "definition": "A GP's brief, checklist-style mental health screening (e.g. a short PHQ-9 style questionnaire) is a standard clinical tool, not a sign the conversation is being rushed or the concern minimized.",
    "surfaceMarkers": "A GP reading out a short set of standardized questions from a screen rather than an open-ended conversation.",
    "whatItMeans": "This is a validated clinical instrument used to structure the assessment, not a replacement for a fuller conversation — more time and follow-up can still be requested.",
    "example": "A client felt their mental health concern wasn't taken seriously because the GP mostly worked through a short questionnaire rather than talking freely.",
    "goodResponse": "After the questionnaire, ask directly: “Can we talk a bit more about what's actually going on, beyond these questions?”",
    "status": "Draft"
  },
  {
    "normId": "HL-3-inventory-check-in-formality",
    "category": "Housing & landlord",
    "definition": "A detailed, formal move-in inventory and condition report is standard UK rental practice and protects the tenant as much as the landlord — it isn't a sign of distrust.",
    "surfaceMarkers": "A lengthy printed or app-based inventory listing every mark, scuff, and item condition, often with photos, at move-in.",
    "whatItMeans": "This document is the tenant's main protection against unfair deposit deductions later — treating it as excessive or skipping a careful read works against the tenant's own interest.",
    "example": "A client rushed through signing the move-in inventory to seem agreeable, then couldn't dispute a deposit deduction for a mark that was actually already there.",
    "goodResponse": "Take time to check the inventory thoroughly and add notes/photos for anything inaccurate before signing, regardless of how quick the landlord seems to want it done.",
    "status": "Draft"
  },
  {
    "normId": "HL-4-section-21-notice-tone",
    "category": "Housing & landlord",
    "definition": "A formal written notice (e.g. a Section 21 “no fault” notice) can be delivered in flat, procedural legal language even when the underlying relationship with the landlord has been perfectly amicable — the tone doesn't indicate personal conflict.",
    "surfaceMarkers": "A sudden formal letter with legal section references and fixed-format wording, arriving without any prior change in the landlord's usual friendly tone.",
    "whatItMeans": "This is procedural and often driven by external factors (landlord selling, remortgaging), not necessarily a reaction to the tenant personally.",
    "example": "A client received a formal eviction notice from an otherwise friendly landlord and assumed they'd done something wrong; the landlord was simply selling the property.",
    "goodResponse": "Contact the landlord directly to ask the reason, and separately seek advice on the legal process and timeline — the two are independent tracks.",
    "status": "Draft"
  },
  {
    "normId": "HL-5-deposit-protection-scheme-silence",
    "category": "Housing & landlord",
    "definition": "Landlords are legally required to protect a tenant's deposit in a government-approved scheme and provide proof within 30 days — but they often won't proactively explain this, expecting the tenant to know to ask.",
    "surfaceMarkers": "No mention of deposit protection at move-in beyond a brief line in the contract, and no proactive confirmation email.",
    "whatItMeans": "The absence of explanation doesn't mean it hasn't been done (or that it's being skipped) — but it's the tenant's responsibility to confirm, not something that will necessarily be volunteered.",
    "example": "A client never received confirmation their deposit was protected and assumed asking would seem distrustful, so never followed up — leaving them unable to verify their legal protection.",
    "goodResponse": "Ask directly and in writing within the first few weeks: “Could you send me the deposit protection scheme reference for my deposit?” — this is a standard, expected request, not an accusation.",
    "status": "Draft"
  },
  {
    "normId": "HL-6-shared-house-kitchen-etiquette-notes",
    "category": "Housing & landlord",
    "definition": "Written notes left in shared kitchens/bathrooms about mess, dishes, or shared items are a common indirect way flatmates raise ongoing frustration, rather than a one-off, low-stakes reminder.",
    "surfaceMarkers": "A note on the fridge or whiteboard: “Can everyone please remember to wash up their own dishes :)” — friendly phrasing, but often after repeated unaddressed frustration.",
    "whatItMeans": "By the time a note appears, the issue has likely been building for a while — it's rarely the first time it's bothered someone.",
    "example": "A client saw a cheerful note about washing dishes and didn't think much of it, not realizing a flatmate had been quietly frustrated for weeks.",
    "goodResponse": "Respond to a shared-space note promptly and directly, and consider a brief in-person acknowledgment: “Sorry, I'll sort that — let me know if it's been an ongoing issue.”",
    "status": "Draft"
  },
  {
    "normId": "HL-7-viewing-feedback-silence",
    "category": "Housing & landlord",
    "definition": "Not hearing back after a rental viewing, even after being told “we'll be in touch,” commonly means the application was unsuccessful — landlords and agents rarely send explicit rejections.",
    "surfaceMarkers": "“We'll let you know” at the end of a viewing, followed by no contact within the stated or implied timeframe.",
    "whatItMeans": "Silence past the expected timeframe functions as the rejection in UK rental practice — an explicit “no” is uncommon.",
    "example": "A client kept waiting to hear back after a viewing for two weeks, assuming they were still being considered, and missed other opportunities in the meantime.",
    "goodResponse": "Treat silence past the stated timeframe as a likely no and keep actively viewing other properties in parallel, following up once politely for a final answer.",
    "status": "Draft"
  },
  {
    "normId": "JS-3-cv-personal-statement-understatement",
    "category": "Job search",
    "definition": "UK CVs and cover letters traditionally favor understated, evidence-led language over overt self-promotion — the British norm skews toward “developed” and “contributed to” rather than “spearheaded” and “transformed.”",
    "surfaceMarkers": "Hiring feedback or example CVs that read as modest and factual compared to CVs from more self-promotional cultures.",
    "whatItMeans": "Understated language is not a lack of confidence in this context — being extremely self-promotional can actually read as less credible in some UK sectors, particularly traditional or public-sector ones.",
    "example": "A client's confident, achievement-heavy CV drew less positive feedback than expected from UK recruiters, who found the tone off-putting rather than impressive.",
    "goodResponse": "Lead with specific, factual outcomes (numbers, concrete results) rather than superlative language — let the evidence carry the weight instead of the adjectives.",
    "status": "Draft"
  },
  {
    "normId": "JS-4-recruiter-warm-language-non-commitment",
    "category": "Job search",
    "definition": "Recruiters often use warm, encouraging language throughout a process without it reflecting an actual decision or preference — professional friendliness is separate from outcome.",
    "surfaceMarkers": "“You're a really strong candidate,” “the client loved you” — said before any offer or explicit next-step confirmation.",
    "whatItMeans": "This is standard relationship-management language recruiters use with most candidates to keep them engaged, not a reliable signal of where you stand.",
    "example": "A client was told repeatedly they were “the client's favorite” and assumed the job was essentially theirs, then didn't get an offer.",
    "goodResponse": "Ask directly for concrete next steps and timelines rather than reading warmth as commitment: “What's the next formal step, and by when should I expect to hear?”",
    "status": "Draft"
  },
  {
    "normId": "JS-5-competency-question-structure-expectation",
    "category": "Job search",
    "definition": "UK interviews frequently use structured competency questions (“Tell me about a time when...”) expecting a specific STAR-style (Situation, Task, Action, Result) answer format, not a general conversational response.",
    "surfaceMarkers": "“Tell me about a time when you had to deal with a difficult colleague” asked as a standalone question, with the interviewer waiting for a structured example.",
    "whatItMeans": "A vague or general answer (“I always try to communicate well”) reads as unprepared — a specific, structured past example is what's actually being assessed.",
    "example": "A client answered competency questions with general philosophy statements rather than specific stories, and was told afterward the answers “lacked detail,” without understanding why.",
    "goodResponse": "Prepare 4-5 specific past examples in advance, structured as situation → task → action → result, ready to adapt to different competency questions.",
    "status": "Draft"
  },
  {
    "normId": "JS-6-notice-period-negotiation-norm",
    "category": "Job search",
    "definition": "Stating a full statutory or contractual notice period when asked about availability is expected and normal — it is not read as a lack of enthusiasm for the new role.",
    "surfaceMarkers": "“When could you start?” asked directly in an interview or offer stage.",
    "whatItMeans": "Employers expect and plan around a standard notice period; a shorter-than-normal answer isn't required to demonstrate keenness, and honesty here is the norm, not a risk.",
    "example": "A client considered saying they could start immediately, despite a month's notice at their current job, out of fear of seeming uncommitted, before checking what was actually expected.",
    "goodResponse": "State the real notice period plainly and, if genuinely relevant, add a brief note of enthusiasm: “My notice period is one month, but I'm very keen to start as soon as that allows.”",
    "status": "Draft"
  },
  {
    "normId": "JS-7-networking-coffee-informality",
    "category": "Job search",
    "definition": "A “let's grab a coffee” or informal chat request from a UK professional contact is a genuine, low-stakes networking norm — it is not a lesser or performative substitute for a real meeting.",
    "surfaceMarkers": "“Would you fancy a coffee sometime to chat about X?” proposed instead of a formal meeting request.",
    "whatItMeans": "This is a standard, taken-seriously way to build a professional relationship or explore an opportunity informally — showing up prepared and treating it as a real conversation is expected, not just small talk.",
    "example": "A client treated an informal coffee invitation from a senior contact as purely social and came without any preparation, missing a genuine opportunity to discuss a role.",
    "goodResponse": "Treat an informal coffee/chat invitation from a professional contact as a real opportunity — prepare a few relevant points or questions, same as for a formal meeting.",
    "status": "Draft"
  },
  {
    "normId": "SO-1-self-deprecating-humor-not-literal",
    "category": "Social",
    "definition": "Self-deprecating jokes (“I'm useless at this,” “typical me, running late again”) are a common social register and not meant to be taken as literal, serious self-assessment.",
    "surfaceMarkers": "Light, joking self-criticism delivered with a smile or in a casual tone, often about a minor mistake.",
    "whatItMeans": "This is typically a bonding or humility-signaling social habit, not a genuine request for reassurance or a literal statement of low self-worth.",
    "example": "A client's British colleague joked “I'm hopeless with technology” after a minor mistake, and the client responded with unexpectedly serious reassurance, which felt oddly formal to the colleague.",
    "goodResponse": "A light, matching response (“ha, we've all been there”) usually lands better than serious reassurance for a clearly joking self-deprecating comment.",
    "status": "Draft"
  },
  {
    "normId": "SO-2-declining-invitation-vague-excuse",
    "category": "Social",
    "definition": "A vague, non-specific reason for declining a social invitation (“I've got something on that day”) is a normal, polite way to decline without giving a real reason — pressing for details can feel intrusive.",
    "surfaceMarkers": "“I've got a bit of a thing that day, sorry!” with no further detail offered or volunteered.",
    "whatItMeans": "The vagueness is intentional and socially acceptable — it isn't an invitation to ask follow-up questions about what the “thing” actually is.",
    "example": "A client kept asking a colleague for more detail about their vague excuse for missing a work social, which made the colleague visibly uncomfortable.",
    "goodResponse": "Accept a vague decline at face value with a simple “no worries, another time!” rather than probing for the real reason.",
    "status": "Draft"
  },
  {
    "normId": "SO-3-queueing-norm-enforcement",
    "category": "Social",
    "definition": "Queueing (waiting in line) in order of arrival is a strongly enforced social norm; visible frustration or comment is common if someone appears to jump the queue, even unintentionally.",
    "surfaceMarkers": "Pointed looks, an audible tut, or a polite-but-firm “I think the queue starts back there” if someone doesn't notice a line.",
    "whatItMeans": "Queue order is taken seriously as a matter of fairness, and a correction — even a mild one — reflects a real social expectation, not an overreaction.",
    "example": "A client didn't realize a loose cluster of people near a counter was actually a queue and stepped toward the front, prompting visible annoyance from others.",
    "goodResponse": "When uncertain whether a group is queueing, ask directly: “Sorry, is this the end of the queue?” — a completely normal and expected question.",
    "status": "Draft"
  },
  {
    "normId": "SO-4-small-talk-weather-function",
    "category": "Social",
    "definition": "Weather-focused small talk at the start of an interaction isn't really about the weather — it's a low-stakes way to open a conversation and signal friendliness before the actual topic.",
    "surfaceMarkers": "“Terrible weather we're having, isn't it?” said by a stranger, shopkeeper, or acquaintance as a conversation opener.",
    "whatItMeans": "This is a social ritual to establish a friendly tone, not a genuine request for detailed opinion or information about the weather.",
    "example": "A client gave a long, detailed answer about weather patterns to a simple opening remark, which came across as oddly serious rather than as the light exchange it was meant to be.",
    "goodResponse": "A brief, light agreement (“I know, awful, isn't it!”) is the expected response — treat it as a greeting, not a real question.",
    "status": "Draft"
  },
  {
    "normId": "SO-5-punctuality-for-social-events",
    "category": "Social",
    "definition": "For informal social gatherings (dinner at someone's home, a casual meetup), arriving slightly late (5-15 minutes) is often more normal and expected than arriving exactly on time or early, though this varies more than workplace punctuality.",
    "surfaceMarkers": "A host still visibly preparing when a guest arrives exactly on time, or other guests arriving noticeably after the stated time.",
    "whatItMeans": "For casual social events specifically (not formal or work-related ones), the stated time is often treated as approximate rather than fixed — arriving exactly on time can occasionally catch a host still getting ready.",
    "example": "A client arrived precisely on time to a casual dinner party and found the host still cooking, unprepared for guests, creating an awkward start.",
    "goodResponse": "For clearly informal social invitations, treat the stated time as approximate and consider arriving 10-15 minutes after — though always exactly on time for anything formal or work-related.",
    "status": "Draft"
  },
  {
    "normId": "AB-1-council-tax-band-query-formality",
    "category": "Admin & bureaucracy",
    "definition": "Contacting the local council about council tax, bins, or similar services usually requires going through a formal online form or long phone queue, even for simple questions — this reflects the system's structure, not unhelpfulness.",
    "surfaceMarkers": "A council website directing every query, however small, to a multi-step form or a phone line with a long wait, with no direct email option.",
    "whatItMeans": "This is the standard structure of UK local council service delivery, not a sign the council is uninterested in resolving a simple issue quickly.",
    "example": "A client wanted to ask a quick question about their council tax band and was frustrated to find only a lengthy form or a 40-minute phone queue as options, assuming this meant the council was being deliberately unhelpful.",
    "goodResponse": "Use the official form or phone line as the expected channel, and if it's genuinely urgent, note that clearly at the start of the request rather than expecting a faster informal route.",
    "status": "Draft"
  },
  {
    "normId": "AB-2-bank-letter-formal-tone-routine",
    "category": "Admin & bureaucracy",
    "definition": "Formal-sounding letters from a bank (e.g. requesting updated ID or address proof) are often routine compliance checks, not a sign of a problem with the account.",
    "surfaceMarkers": "A letter with serious, legal-sounding language (“failure to respond may result in restrictions”) requesting standard documentation.",
    "whatItMeans": "Banks are required to periodically verify customer information for regulatory reasons; the formal tone is standard template language, not an indication of suspicion about the specific account.",
    "example": "A client received a formal-sounding letter asking for updated proof of address and panicked, assuming their account was under investigation, when it was a routine periodic check.",
    "goodResponse": "Respond to the specific document request within the stated deadline; if genuinely uncertain, call the number on an official statement (not the letter) to confirm it's routine.",
    "status": "Draft"
  },
  {
    "normId": "AB-3-gp-registration-proof-of-address-strictness",
    "category": "Admin & bureaucracy",
    "definition": "Registering with a GP, opening a bank account, or similar admin tasks often require very specific, narrowly-defined proof-of-address documents — being told a document “doesn't count” is a standard bureaucratic rule, not personal scrutiny.",
    "surfaceMarkers": "A receptionist or clerk saying “we can't accept that, it needs to be a utility bill or bank statement from the last 3 months” after a tenancy agreement or other document is offered.",
    "whatItMeans": "This reflects fixed institutional rules applied uniformly to everyone, not a judgement being made about this specific case.",
    "example": "A client felt singled out when their tenancy agreement was rejected as proof of address at a GP registration, not realizing this is a standard, universally-applied rule.",
    "goodResponse": "Ask in advance exactly which documents are accepted before attending in person, to avoid a wasted trip and the frustration of an on-the-spot rejection.",
    "status": "Draft"
  },
  {
    "normId": "AB-4-hmrc-letter-response-urgency-mismatch",
    "category": "Admin & bureaucracy",
    "definition": "HMRC (tax authority) correspondence uses very formal, sometimes alarming-sounding legal language even for routine or minor matters — the tone doesn't reliably indicate the seriousness of the actual issue.",
    "surfaceMarkers": "Legal-sounding phrases like “you may be liable for a penalty” appearing in letters about comparatively minor, easily-resolved discrepancies.",
    "whatItMeans": "Standardized formal wording is used across the full range of HMRC correspondence, from serious to trivial, so the tone alone shouldn't be used to gauge urgency.",
    "example": "A client received an HMRC letter about a minor discrepancy worded in intimidating legal language and assumed a serious problem, causing significant unnecessary anxiety before calling to check.",
    "goodResponse": "Read the specific factual content (what's actually being asked or stated), and call HMRC directly to clarify actual urgency and next steps rather than reacting to the tone.",
    "status": "Draft"
  },
  {
    "normId": "AB-5-visa-immigration-advisor-directness-expectation",
    "category": "Admin & bureaucracy",
    "definition": "When dealing with immigration solicitors or advisors, being direct about deadlines, costs, and requirements is expected and welcomed — vague, softened questions often get vague, softened (less useful) answers.",
    "surfaceMarkers": "An advisor giving a general, hedged response (“it depends,” “generally speaking”) to a vaguely-phrased question.",
    "whatItMeans": "Professional UK advisors typically respond in kind to how a question is asked — a specific, direct question usually receives a specific, direct, more useful answer.",
    "example": "A client asked an immigration advisor “is my situation okay?” and received a vague, general reassurance, when a more specific question about a particular requirement would have gotten a clearer, more useful answer.",
    "goodResponse": "Ask specific, direct questions (“What exactly is the minimum bank balance required, and for how many days?”) rather than broad ones, to get equally specific answers.",
    "status": "Draft"
  }
];
