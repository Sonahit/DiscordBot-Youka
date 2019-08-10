package frame.models;

public class BotProcess implements Comparable<BotProcess> {
	private Process p;
	private String path;
	private String env;

	public BotProcess(String env, String path) {
		setPath(path);
		setEnv(env);
	}

	BotProcess(Process p) {
		this.p = p;
	}

	public Process getProcess() {
		return p;
	}

	public void setProcess(Process p) {
		this.p = p;
	}

	public String getCommand() {
		return getEnv() + " " + "\"" + getPath() + "\"";
	}

	public void setCommand(String env, String path) {
		setEnv(env);
		setPath(path);
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	public boolean isAlive() {
		if (this.getProcess() == null) {
			return false;
		}
		return this.getProcess().isAlive();
	}

	@Override
	public int compareTo(BotProcess o) {
		if (this.env.charAt(0) == o.getEnv().charAt(0)) {
			return 0;
		}
		return this.env.charAt(0) > o.getEnv().charAt(0) ? 1 : -1;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((env == null) ? 0 : env.hashCode());
		result = prime * result + ((path == null) ? 0 : path.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BotProcess other = (BotProcess) obj;
		if (env == null) {
			if (other.env != null)
				return false;
		} else if (!env.equals(other.env))
			return false;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		return true;
	}

}
