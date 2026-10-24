import { useEffect, useState } from "react";
import "./App.css";

const defaultAdminForm = {
  name: "",
  keywords: "",
  visitRequired: "MAYBE",
  onlineAvailable: true,
  documents: "",
  procedure: "",
  fees: "To be verified",
  processingTime: "To be verified",
  department: "",
  officeLocation: "To be verified",
  onlineApplicationUrl: "",
  conditions: "",
  description: "",
  verificationSource: "Pending official college verification",
  status: "sample",
  lastVerified: "",
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Assistant", href: "#assistant" },
  { label: "About", href: "#about" },
];

const quickSearches = [
  "I need a bonafide certificate",
  "Do I need to visit college for a migration certificate?",
  "How can I submit my exam form?",
  "Where can I apply for my degree certificate?",
];

const serviceCards = [
  {
    name: "Bonafide Certificate",
    icon: "badge",
    description: "Need a certificate confirming your enrollment and student status?",
  },
  {
    name: "Exam Form",
    icon: "form",
    description: "Check the procedure and whether a visit is needed before you leave home.",
  },
  {
    name: "Migration Certificate",
    icon: "travel",
    description: "Find the steps for transfer or migration-related service requests.",
  },
  {
    name: "Degree Certificate",
    icon: "degree",
    description: "Understand the process, department, and documentation for degree-related queries.",
  },
  {
    name: "Extra-Curricular Activity Certificate",
    icon: "spark",
    description: "Review requirements for certificates connected to student activities and events.",
  },
];

const chatSuggestions = [
  "What documents are required for a bonafide certificate?",
  "Do I need to visit college for this service?",
  "Where can I find the relevant department?",
  "How long is the BCA degree?",
];

function formatDate(value) {
  if (!value) { return "To be verified"; }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) { return "To be verified"; }
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function getVisitMessage(value) {
  switch (value) {
    case "YES": return "You need to visit college.";
    case "NO": return "You do not need to visit college for this process.";
    case "MAYBE": return "A physical visit may be required depending on your situation.";
    default: return "Visit requirement is currently being verified.";
  }
}

function mapServiceToForm(service = {}) {
  return {
    name: service.name || "",
    keywords: Array.isArray(service.keywords) ? service.keywords.join(", ") : "",
    visitRequired: service.visitRequired || "MAYBE",
    onlineAvailable: Boolean(service.onlineAvailable),
    documents: Array.isArray(service.documents) ? service.documents.join("\n") : "",
    procedure: Array.isArray(service.procedure) ? service.procedure.join("\n") : "",
    fees: service.fees || "To be verified",
    processingTime: service.processingTime || "To be verified",
    department: service.department || "",
    officeLocation: service.officeLocation || "To be verified",
    onlineApplicationUrl: service.onlineApplicationUrl || "",
    conditions: Array.isArray(service.conditions) ? service.conditions.join("\n") : "",
    description: service.description || "",
    verificationSource: service.verificationSource || "Pending official college verification",
    status: service.status || "sample",
    lastVerified: service.lastVerified ? new Date(service.lastVerified).toISOString().split("T")[0] : "",
  };
}

function ServiceIcon({ type }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "badge":
      return (
        <svg {...commonProps}>
          <path d="M7 4h10a2 2 0 0 1 2 2v6.5A2.5 2.5 0 0 1 16.5 15H15l-3 3-3-3h-1.5A2.5 2.5 0 0 1 5 12.5V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8.5h6M9 11.5h6" />
        </svg>
      );
    case "form":
      return (
        <svg {...commonProps}>
          <path d="M7 5.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
          <path d="M8 9h8M8 12h8M8 15h5" />
        </svg>
      );
    case "travel":
      return (
        <svg {...commonProps}>
          <path d="M3.5 15.5V9.7l5.4-2.5 4.2 2L20 7.3v8.2l-7 2.8-4.2-2-5.3 2.4Z" />
          <path d="M9 7.2V5.5M13.7 9.5v2.2" />
        </svg>
      );
    case "degree":
      return (
        <svg {...commonProps}>
          <path d="M12 4.5 4 8.2l8 3.8 8-3.8-8-3.7Z" />
          <path d="M7 10.5v3.7c0 1.2 2.2 2.8 5 2.8s5-1.6 5-2.8v-3.7" />
        </svg>
      );
    case "spark":
      return (
        <svg {...commonProps}>
          <path d="m12 2.5 1.8 5.4 5.7 1.8-5.7 1.8L12 16.7l-1.8-5.2-5.7-1.8 5.7-1.8L12 2.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

function App() {
  const [searchText, setSearchText] = useState("I need a bonafide certificate");
  const [result, setResult] = useState(null);
  const [answerPreview, setAnswerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminServices, setAdminServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [adminForm, setAdminForm] = useState(defaultAdminForm);
  const [adminMessage, setAdminMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hi! I can help you check whether a college service needs a physical visit. Try a service or a natural-language question.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const loadAdminServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) { throw new Error("Unable to load services"); }
      const data = await response.json();
      setAdminServices(data);
      if (data.length > 0) {
        const firstService = data[0];
        setSelectedServiceId(firstService._id);
        setAdminForm(mapServiceToForm(firstService));
      } else {
        setSelectedServiceId("");
        setAdminForm(defaultAdminForm);
      }
    } catch (error) {
      setAdminMessage("Prototype admin is unavailable right now. Please check the backend server.");
    }
  };

  useEffect(() => {
    loadAdminServices();
  }, []);

  const searchService = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResult({ name: "Please enter a service", status: "Search required", description: "Type the service you need, for example: Bonafide Certificate, Exam Form, or Migration Certificate." });
      setAnswerPreview(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/services/search?q=${encodeURIComponent(trimmedQuery)}`);
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || "No matching service found"); }
      setResult(data);

      const answerResponse = await fetch(`/api/services/answer?q=${encodeURIComponent(trimmedQuery)}`);
      const answerData = await answerResponse.json();
      if (answerResponse.ok) {
        setAnswerPreview(answerData);
      } else {
        setAnswerPreview(null);
      }
    } catch (error) {
      setResult({
        name: "Sorry, I couldn't find a matching college service.",
        status: "No matching service",
        description: "Try searching for Exam Form, Bonafide Certificate, Migration Certificate, Degree Certificate, or Extra-Curricular Activity Certificate.",
      });
      setAnswerPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => searchService(searchText);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const showService = (serviceName) => {
    setSearchText(serviceName);
    searchService(serviceName);
  };
  const handleQuickSearch = (query) => {
    setSearchText(query);
    searchService(query);
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const trimmedInput = chatInput.trim();
    if (!trimmedInput || chatLoading) {
      return;
    }

    setChatMessages((previousMessages) => [...previousMessages, { id: Date.now(), sender: "user", text: trimmedInput }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(`/api/services/search?q=${encodeURIComponent(trimmedInput)}`);
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || "Unable to find a matching service."); }

      const visitResponse = getVisitMessage(data.visitRequired || "MAYBE");
      const departmentText = data.department ? ` The concerned department is ${data.department}.` : "";
      setChatMessages((previousMessages) => [...previousMessages, { id: Date.now() + 1, sender: "assistant", text: `I found ${data.name}. ${visitResponse}${departmentText}` }]);
    } catch (error) {
      setChatMessages((previousMessages) => [...previousMessages, { id: Date.now() + 2, sender: "assistant", text: "I couldn't find a verified match for that yet. Try a service like Bonafide Certificate or Exam Form, or check with the college department." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAdminSelect = (event) => {
    const serviceId = event.target.value;
    const selectedService = adminServices.find((item) => item._id === serviceId);
    setSelectedServiceId(serviceId);
    setAdminForm(mapServiceToForm(selectedService || {}));
  };

  const handleAdminFieldChange = (event) => {
    const { name, type, value, checked } = event.target;
    setAdminForm((previousForm) => ({ ...previousForm, [name]: type === "checkbox" ? checked : value }));
  };

  const saveService = async () => {
    const payload = {
      name: adminForm.name,
      keywords: adminForm.keywords.split(",").map((item) => item.trim()).filter(Boolean),
      visitRequired: adminForm.visitRequired,
      onlineAvailable: Boolean(adminForm.onlineAvailable),
      documents: adminForm.documents.split("\n").map((item) => item.trim()).filter(Boolean),
      procedure: adminForm.procedure.split("\n").map((item) => item.trim()).filter(Boolean),
      fees: adminForm.fees,
      processingTime: adminForm.processingTime,
      department: adminForm.department,
      officeLocation: adminForm.officeLocation,
      onlineApplicationUrl: adminForm.onlineApplicationUrl,
      conditions: adminForm.conditions.split("\n").map((item) => item.trim()).filter(Boolean),
      description: adminForm.description,
      verificationSource: adminForm.verificationSource,
      status: adminForm.status,
      lastVerified: adminForm.lastVerified ? new Date(adminForm.lastVerified).toISOString() : null,
    };

    try {
      const url = selectedServiceId ? `/api/services/${selectedServiceId}` : "/api/services";
      const method = selectedServiceId ? "PUT" : "POST";
      const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || "Unable to save service"); }
      setAdminMessage(`Service saved successfully: ${data.name}`);
      await loadAdminServices();
      if (data._id) {
        setSelectedServiceId(data._id);
        setAdminForm(mapServiceToForm(data));
      }
    } catch (error) {
      setAdminMessage(error.message);
    }
  };

  const deleteService = async () => {
    if (!selectedServiceId) {
      setAdminMessage("Select a service before deleting it.");
      return;
    }

    try {
      const response = await fetch(`/api/services/${selectedServiceId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.message || "Unable to delete service"); }
      setAdminMessage("Service deleted successfully.");
      setSelectedServiceId("");
      setAdminForm(defaultAdminForm);
      await loadAdminServices();
    } catch (error) {
      setAdminMessage(error.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Do I Need to Go home">
          <span className="brand-mark">?</span>
          <span className="brand-text">Do I Need To Go?</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Your college service guide</span>
              <h1>KNOW<br />BEFORE<br />YOU GO.</h1>
              <p className="hero-text">Get clear answers about college services before making a physical visit. Find procedures, documents, departments, and online options in one place.</p>

              <div className="search-panel">
                <div className="search-input-wrap">
                  <span className="search-icon" aria-hidden="true">⌕</span>
                  <input type="text" placeholder="Try “bonafide certificate”" value={searchText} onChange={(event) => setSearchText(event.target.value)} onKeyDown={handleKeyDown} aria-label="Search college services" />
                </div>
                <div className="search-actions">
                  <button type="button" className="primary-button" onClick={handleSearch} disabled={loading}>{loading ? "Finding..." : "Find My Service"}</button>
                  <a href="#services" className="secondary-button">Explore Services</a>
                </div>
              </div>

              <div className="query-chips" aria-label="Suggested searches">
                {quickSearches.map((query) => (
                  <button key={query} type="button" onClick={() => handleQuickSearch(query)}>{query}</button>
                ))}
              </div>

              <div className="trust-row">
                <span className="trust-dot" aria-hidden="true" />
                <span>Your college service guide.</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Smart college service assistant preview">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <div className="floating-note note-top"><span className="note-icon">✓</span><span>Less guesswork<br /><strong>More clarity</strong></span></div>

              <div className="service-preview">
                <div className="preview-header">
                  <span className="preview-label">SERVICE GUIDE</span>
                  <span className="preview-menu" aria-hidden="true">•••</span>
                </div>
                <div className="preview-illustration" aria-hidden="true">
                  <div className="sun" />
                  <div className="building building-back"><span /><span /><span /><span /></div>
                  <div className="building building-front"><span /><span /><span /><span /><span /><span /></div>
                  <div className="path" />
                  <div className="plant one">✦</div>
                  <div className="plant two">✦</div>
                </div>
                <div className="preview-footer">
                  <div>
                    <span className="preview-caption">A LITTLE PREP</span>
                    <strong>Go prepared.</strong>
                  </div>
                  <span className="preview-arrow">↗</span>
                </div>
              </div>

              <div className="floating-note note-bottom"><span className="note-icon alt">⌖</span><span><strong>Know before you go</strong><br />Your next step, made clear</span></div>
            </div>
          </div>
        </section>

        {loading && (
          <section className="result-shell">
            <div className="result-card loading-card">
              <div className="result-label">RESULT</div>
              <h2>Finding verified college information...</h2>
            </div>
          </section>
        )}

        {result && !loading && (
          <section className="result-shell">
            <div className="result-card detailed-result">
              <div className="result-label">RESULT</div>
              <div className="result-topline">
                <span className="result-category">{result.status || "Sample data"}</span>
                <span className={`visit-pill ${String(result.visitRequired || "MAYBE").toLowerCase()}`}>{result.visitRequired || "MAYBE"}</span>
              </div>

              <h2>{result.name}</h2>
              <p className="visit-message">{getVisitMessage(result.visitRequired || "MAYBE")}</p>

              <div className="info-grid">
                <div><h3>Online available</h3><p>{result.onlineAvailable ? "YES" : "NO"}</p></div>
                <div><h3>Department</h3><p>{result.department || "To be verified"}</p></div>
                <div><h3>Fees</h3><p>{result.fees || "To be verified"}</p></div>
                <div><h3>Processing time</h3><p>{result.processingTime || "To be verified"}</p></div>
              </div>

              <div className="content-block"><h3>Documents required</h3><ul>{(result.documents && result.documents.length > 0 ? result.documents : ["To be verified"]).map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div className="content-block"><h3>Procedure</h3><ol>{(result.procedure && result.procedure.length > 0 ? result.procedure : ["Procedure details are pending official verification."]).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol></div>
              <div className="content-block"><h3>Office location</h3><p>{result.officeLocation || "To be verified"}</p></div>
              <div className="content-block"><h3>Online application</h3>{result.onlineApplicationUrl ? <a href={result.onlineApplicationUrl} target="_blank" rel="noreferrer">View Application</a> : <p>Not currently available</p>}</div>
              <div className="content-block"><h3>Conditions</h3><ul>{(result.conditions && result.conditions.length > 0 ? result.conditions : ["To be verified"]).map((item) => <li key={item}>{item}</li>)}</ul></div>

              <div className="content-block meta-row">
                <div><h3>Last verified</h3><p>{formatDate(result.lastVerified)}</p></div>
                <div><h3>Status</h3><p>{result.status || "sample"}</p></div>
              </div>

              {answerPreview && (
                <div className="ai-preview">
                  <div className="result-label">AI-READY CONTEXT</div>
                  <h3>{answerPreview.serviceName}</h3>
                  <p>{answerPreview.answerTemplate}</p>
                  <ul>{answerPreview.aiInstructions.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="services-section" id="services">
          <div className="section-heading">
            <span className="section-kicker">COLLEGE SERVICES</span>
            <h2>What do you need?</h2>
            <p>Select a service or search for it above.</p>
          </div>

          <div className="service-grid">
            {serviceCards.map((service, index) => (
              <button key={service.name} type="button" className="service-card" onClick={() => showService(service.name)}>
                <div className="service-icon-wrap"><ServiceIcon type={service.icon} /></div>
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <span className="service-link">Explore Service <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="features-section" id="about">
          <div className="section-heading">
            <span className="section-kicker">WHY USE THIS</span>
            <h2>Built to simplify student life</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-badge">01</span>
              <h3>Clear visit guidance</h3>
              <p>Know whether a service requires a physical visit before you waste time and effort.</p>
            </article>
            <article className="feature-card">
              <span className="feature-badge">02</span>
              <h3>Everything in one place</h3>
              <p>Find documents, steps, departments, and online options without digging through scattered information.</p>
            </article>
            <article className="feature-card">
              <span className="feature-badge">03</span>
              <h3>Smart service matching</h3>
              <p>Natural-language queries can surface the right service and help students act quickly.</p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="section-kicker accent">HOW IT WORKS</span>
            <h2>Three simple steps.</h2>
          </div>

          <div className="step-grid">
            <div className="step-card"><span className="step-number">01</span><h3>Search</h3><p>Tell us which college service you need.</p></div>
            <div className="step-card"><span className="step-number">02</span><h3>Get Information</h3><p>Find the procedure, documents, department, and available online options.</p></div>
            <div className="step-card"><span className="step-number">03</span><h3>Know Before You Go</h3><p>Understand whether a physical visit is required before leaving home.</p></div>
          </div>
        </section>

        <section className="admin-section" id="admin">
          <div className="section-heading">
            <span className="section-kicker">PROTOTYPE ADMIN</span>
            <h2>Maintain service records</h2>
            <p>Simple prototype admin for updating service information in MongoDB.</p>
          </div>

          <div className="admin-panel">
            <div className="admin-toolbar">
              <label>
                Select a service
                <select value={selectedServiceId} onChange={handleAdminSelect}>
                  <option value="">Create new record</option>
                  {adminServices.map((service) => <option key={service._id} value={service._id}>{service.name}</option>)}
                </select>
              </label>
            </div>

            <div className="admin-form-grid">
              <label>Service name<input type="text" name="name" value={adminForm.name} onChange={handleAdminFieldChange} /></label>
              <label>Keywords (comma separated)<input type="text" name="keywords" value={adminForm.keywords} onChange={handleAdminFieldChange} /></label>
              <label>Visit required<select name="visitRequired" value={adminForm.visitRequired} onChange={handleAdminFieldChange}><option value="YES">YES</option><option value="NO">NO</option><option value="MAYBE">MAYBE</option></select></label>
              <label className="checkbox-row"><input type="checkbox" name="onlineAvailable" checked={adminForm.onlineAvailable} onChange={handleAdminFieldChange} />Online available</label>
              <label>Department<input type="text" name="department" value={adminForm.department} onChange={handleAdminFieldChange} /></label>
              <label>Fees<input type="text" name="fees" value={adminForm.fees} onChange={handleAdminFieldChange} /></label>
              <label>Processing time<input type="text" name="processingTime" value={adminForm.processingTime} onChange={handleAdminFieldChange} /></label>
              <label>Office location<input type="text" name="officeLocation" value={adminForm.officeLocation} onChange={handleAdminFieldChange} /></label>
              <label>Online application URL<input type="text" name="onlineApplicationUrl" value={adminForm.onlineApplicationUrl} onChange={handleAdminFieldChange} /></label>
              <label>Verification source<input type="text" name="verificationSource" value={adminForm.verificationSource} onChange={handleAdminFieldChange} /></label>
              <label>Status<select name="status" value={adminForm.status} onChange={handleAdminFieldChange}><option value="sample">sample</option><option value="verified">verified</option><option value="needs-review">needs-review</option></select></label>
              <label>Last verified<input type="date" name="lastVerified" value={adminForm.lastVerified} onChange={handleAdminFieldChange} /></label>
              <label className="full-width">Description<textarea name="description" value={adminForm.description} onChange={handleAdminFieldChange} rows="3" /></label>
              <label className="full-width">Documents required (one per line)<textarea name="documents" value={adminForm.documents} onChange={handleAdminFieldChange} rows="4" /></label>
              <label className="full-width">Procedure (one per line)<textarea name="procedure" value={adminForm.procedure} onChange={handleAdminFieldChange} rows="4" /></label>
              <label className="full-width">Conditions (one per line)<textarea name="conditions" value={adminForm.conditions} onChange={handleAdminFieldChange} rows="4" /></label>
            </div>

            {adminMessage && <p className="admin-message">{adminMessage}</p>}

            <div className="admin-actions">
              <button type="button" className="primary-button compact" onClick={saveService}>Save service</button>
              <button type="button" className="secondary-button compact" onClick={() => setAdminForm(defaultAdminForm)}>New record</button>
              <button type="button" className="danger-button compact" onClick={deleteService}>Delete</button>
            </div>
          </div>
        </section>
      </main>

      <button type="button" className="assistant-launcher" aria-label="Open AI assistant" onClick={() => setChatOpen((current) => !current)}><span className="assistant-bubble">AI</span></button>

      {chatOpen && (
        <aside className="assistant-panel" id="assistant" aria-live="polite">
          <div className="assistant-header">
            <div>
              <span className="section-kicker small">AI ASSISTANT</span>
              <h3>College support</h3>
            </div>
            <button type="button" className="close-button" onClick={() => setChatOpen(false)} aria-label="Close AI assistant">×</button>
          </div>

          <div className="assistant-body">
            {chatMessages.map((message) => <div key={message.id} className={`chat-bubble ${message.sender}`}>{message.text}</div>)}
            {chatLoading && <div className="chat-bubble assistant"><div className="typing-dots" aria-label="Assistant is typing"><span /><span /><span /></div></div>}
          </div>

          <div className="assistant-suggestions">
            {chatSuggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setChatInput(suggestion)}>{suggestion}</button>)}
          </div>

          <form className="assistant-form" onSubmit={handleChatSubmit}>
            <input type="text" value={chatInput} placeholder="Ask about a service or department" onChange={(event) => setChatInput(event.target.value)} aria-label="Ask the AI assistant" />
            <button type="submit" disabled={chatLoading}>Send</button>
          </form>
        </aside>
      )}

      <footer className="page-footer">
        <div className="footer-brand">Do I Need To Go?</div>
        <p>Smart student guidance for college services, department queries, and visit planning.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>
        <p className="copyright">© 2026 Do I Need To Go?</p>
      </footer>
    </div>
  );
}

export default App;
