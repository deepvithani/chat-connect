import ChatPopup from './components/ChatPopup';

const App = () => {
  return (
    <main className="app-shell">
      <section className="content-area">
        <h1>Chat Popup Demo</h1>
        <p>
          Click the bubble in the corner to chat with the assistant. The demo keeps conversations
          locally and sends playful automated replies so you can see the full flow.
        </p>
      </section>

      <ChatPopup />
    </main>
  );
};

export default App;

