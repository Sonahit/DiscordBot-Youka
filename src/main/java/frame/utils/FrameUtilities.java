package frame.utils;

import java.awt.Component;
import java.awt.Container;
import java.util.ArrayList;
import java.util.List;

import frame.GUI.GUI;
import frame.managers.BotProcessManager;
import frame.models.BotProcess;

public class FrameUtilities {

	public static List<Component> getAllComponentByClass(final Container c, Class<?> theClass) {
		Component[] comps = c.getComponents();
		List<Component> compList = new ArrayList<Component>();
		for (Component comp : comps) {
			if (theClass.isInstance(comp)) {
				compList.add(comp);
			}
			if (comp instanceof Container) {
				compList.addAll(getAllComponentByClass((Container) comp, theClass));
			}
		}
		return compList;
	}

	public static String getEnvironment() {
		return getEnvironment("");
	}

	public static String getEnvironment(String botDirPath) {
		if (!botDirPath.isEmpty()) {
			BotProcess bp = BotProcessManager.getInstance().getProcessByPath(botDirPath);
			if (bp != null) {
				return bp.getEnv();
			}
		}
		for (String arg : GUI.getInstance().getArgs()) {
			arg = arg.toLowerCase();
			if (arg.contains("env")) {
				return arg.split("env=")[1];
			}
		}
		return "node";
	}

	public static String getBotPath() {
		return getBotPath("");
	}

	public static String getBotPath(String botDirPath) {
		if (!botDirPath.isEmpty()) {
			BotProcess bp = BotProcessManager.getInstance().getProcessByPath(botDirPath);
			if (bp != null) {
				return bp.getPath();
			}
		}
		for (String arg : GUI.getInstance().getArgs()) {
			arg = arg.toLowerCase();
			if (arg.contains("bot_path")) {
				return arg.split("bot_path=")[1];
			}
		}
		return "C:/Users/Ivan/git/Bot/src/bot.js";
	}
}
