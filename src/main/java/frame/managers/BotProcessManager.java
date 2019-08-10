package frame.managers;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import frame.models.BotProcess;

public class BotProcessManager {

	private static volatile BotProcessManager instance;
	// Process, <Path, Env>
	private Map<BotProcess, Entry<String, String>> processes = new TreeMap<BotProcess, Entry<String, String>>();

	private BotProcessManager() {
	}

	public static BotProcessManager getInstance() {
		if (instance != null) {
			return instance;
		}
		instance = new BotProcessManager();
		return instance;
	}

	public Map<BotProcess, Entry<String, String>> getProcesses() {
		return this.processes;
	}

	public List<BotProcess> getAllProcesses() {
		List<BotProcess> bp = new ArrayList<BotProcess>();
		for (Map.Entry<BotProcess, Entry<String, String>> entry : processes.entrySet()) {
			bp.add(entry.getKey());
		}
		return bp;
	}

	public void setProcesses(Map<BotProcess, Entry<String, String>> processes) {
		this.processes = processes;
	}

	public BotProcess getProcessByPath(String path) {
		Iterator<BotProcess> it = processes.keySet().iterator();
		while (it.hasNext()) {
			BotProcess bp = it.next();
			if (bp.getPath().equalsIgnoreCase(path)) {
				return bp;
			}
		}
		return null;
	}

	public BotProcess getProcessByProcess(BotProcess p) {
		Iterator<BotProcess> it = processes.keySet().iterator();
		while (it.hasNext()) {
			BotProcess bp = it.next();
			if (bp.equals(p)) {
				return bp;
			}
		}
		return null;
	}

	public void changeBotProcess() {
		
		
	}
}
