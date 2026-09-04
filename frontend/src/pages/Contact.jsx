export default function Contact({ onBackToLogin }) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Request Access</h3>
        <p className="mb-2">
          This chat application is private. If you want to use it,
          contact the admin to get your secret registration code.
        </p>

        <ul className="list-unstyled mb-3">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:yash.garje31@gmail.com">
              yash.garje31@gmail.com
            </a>
          </li>
          
        </ul>

        <p className="small text-muted">
          Once you get the secret code, go to the Register page and
          create your account.
        </p>

        <button
          className="btn btn-primary w-100 mt-2"
          onClick={onBackToLogin}
        >
          Back to Register
        </button>
      </div>
    </div>
  );
}
