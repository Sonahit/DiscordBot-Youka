package frame.GUI;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Rectangle;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.Map;

import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JScrollPane;
import javax.swing.JTextPane;
import javax.swing.UIManager;
import javax.swing.WindowConstants;
import javax.swing.border.LineBorder;
import javax.swing.border.MatteBorder;

import frame.managers.BotProcessManager;
import frame.models.BotProcess;
import frame.models.Button;
import frame.models.Frame;
import frame.models.Label;
import frame.models.MenuBar;
import frame.models.MultiLabel;
import frame.models.Panel;
import frame.utils.FrameUtilities;
import frame.utils.MapEntry;

public class GUI {

	// TODO Get environment via bot manager ?

	private static GUI instance;
	private String[] args;
	private Frame frame;
	private Panel mainPanel, buttonsPanel;
	private JTextPane infoTable;
	private JScrollPane scrollPane;
	private MenuBar menuBar;
	private Label consoleInfoLabel;
	private MultiLabel labelCommand, envLabel;

	public Frame getFrame() {
		return frame;
	}

	public Panel getMainPanel() {
		return mainPanel;
	}

	public Panel getButtonsPanel() {
		return buttonsPanel;
	}

	public JTextPane getInfoTable() {
		return infoTable;
	}

	public JScrollPane getScrollPane() {
		return scrollPane;
	}

	public MenuBar getMenuBar() {
		return menuBar;
	}

	public Label getConsoleInfoLabel() {
		return consoleInfoLabel;
	}

	public MultiLabel getLabelCommand() {
		return labelCommand;
	}

	private GUI() {
	};

	public static GUI getInstance() {
		if (instance != null) {
			return instance;
		}
		instance = new GUI();
		return instance;
	}

	/**
	 * @wbp.parser.entryPoint
	 */
	public void createAndShowGUI(String[] args) {
		this.args = args;
		// Creating main frame
		frame = new Frame(0, 0, 500, 350);
		frame.setIconImage(new ImageIcon("src/main/java/frame/assets/wrench.png").getImage());
		frame.centerFrame();
		frame.getContentPane().setLayout(new BoxLayout(frame.getContentPane(), BoxLayout.X_AXIS));
		frame.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);
		frame.addWindowListener(new WindowListener() {

			@Override
			public void windowClosed(WindowEvent e) {
			}

			@Override
			public void windowClosing(WindowEvent e) {
				shutdownProcesses();
				System.exit(0);
			}

			private void shutdownProcesses() {
				for (BotProcess process : BotProcessManager.getInstance().getAllProcesses()) {
					if (process.getProcess() != null) {
						process.getProcess().destroy();
						process.setProcess(null);
					}
				}
			}

			@Override
			public void windowDeactivated(WindowEvent e) {
			}

			@Override
			public void windowDeiconified(WindowEvent e) {
			}

			@Override
			public void windowIconified(WindowEvent e) {
			}

			@Override
			public void windowOpened(WindowEvent e) {
			}

			@Override
			public void windowActivated(WindowEvent e) {
			}
		});

		createAndShowPanels();
		createScrollTextPanel();
		createAndShowLabels();
		createButtons();
		createMenu();

		frame.pack();
		frame.setResizable(false);
		frame.setVisible(true);
	}

	private void createMenu() {
		menuBar = new MenuBar();
		menuBar.setBounds(0, 0, 390, 36);
		mainPanel.add(menuBar);
	}

	private void createAndShowPanels() {
		mainPanel = new Panel();
		buttonsPanel = new Panel();
		mainPanel.setBounds(new Rectangle(0, 0, 400, 300));
		mainPanel.setBorder(new LineBorder(new Color(0, 0, 0), 0));
		mainPanel.setPreferredSize(new Dimension(400, 300));
		buttonsPanel.setBorder(new MatteBorder(0, 1, 0, 0, new Color(0, 0, 0)));
		buttonsPanel.setPreferredSize(new Dimension(100, 300));
		frame.getContentPane().add(mainPanel);
		frame.getContentPane().add(buttonsPanel);
	}

	private void createScrollTextPanel() {
		mainPanel.setLayout(null);
		infoTable = new JTextPane();
		infoTable.setFont(new Font("Calibri", Font.PLAIN, 12));
		infoTable.setEditable(false);
		scrollPane = new JScrollPane(infoTable);
		scrollPane.setBounds(10, 47, 375, 150);
		scrollPane.getVerticalScrollBar().setPreferredSize(new Dimension(10, 10));
		mainPanel.add(scrollPane);
	}

	private void createAndShowLabels() {
		consoleInfoLabel = new Label("Console information from bot", "botInfo", true);
		scrollPane.setColumnHeaderView(consoleInfoLabel);
		consoleInfoLabel.setBackground(Color.WHITE);
		labelCommand = new MultiLabel("Command", "commandInfo", true);
		labelCommand.setBackground(UIManager.getColor("Button.background"));
		labelCommand.setBounds(scrollPane.getX() + 100, scrollPane.getY() + scrollPane.getHeight() + 15,
				scrollPane.getWidth() - 100, 30);
		labelCommand.setFont(new Font("Calibri", Font.PLAIN, 12));
		envLabel = new MultiLabel("Env", "envInfo", true);
		envLabel.setBackground(UIManager.getColor("Button.background"));
		envLabel.setBounds(scrollPane.getX(), scrollPane.getY() + scrollPane.getHeight() + 15,
				100, 30);
		envLabel.setFont(new Font("Calibri", Font.PLAIN, 12));
		mainPanel.add(envLabel);
		mainPanel.add(labelCommand);
	}

	public void createButtons() {
		Button exitBtn = new Button("Exit");
		exitBtn.setFont(new Font("Calibri", Font.BOLD, 11));
		exitBtn.setBounds(10, 276, 80, 23);
		Button stopBotBtn = new Button("Stop bot");
		stopBotBtn.setFont(new Font("Calibri", Font.BOLD, 11));
		stopBotBtn.setBounds(10, 45, 80, 23);
		Button startBotBtn = new Button("Start bot");
		startBotBtn.setFont(new Font("Calibri", Font.BOLD, 11));
		startBotBtn.setMinimumSize(new Dimension(84, 23));
		startBotBtn.setPreferredSize(new Dimension(80, 23));
		startBotBtn.setBounds(10, 11, 80, 23);

		// Alignment
		exitBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
		stopBotBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
		startBotBtn.setAlignmentX(Component.CENTER_ALIGNMENT);

		// Adding actions on click
		String env = FrameUtilities.getEnvironment();
		String botPath = FrameUtilities.getBotPath();
		BotProcess bot = new BotProcess(env, botPath);
		labelCommand.setText(botPath);
		envLabel.setText(env);
		Map.Entry<String, String> botProp = new MapEntry<String, String>(env, botPath);
		BotProcessManager.getInstance().getProcesses().put(bot, botProp);
		exitBtn.setActionOnClick("Exit", bot, scrollPane);
		stopBotBtn.setActionOnClick("StopBot", bot, scrollPane);
		startBotBtn.setActionOnClick("StartBot", bot, scrollPane);
		buttonsPanel.setLayout(null);
		buttonsPanel.add(startBotBtn);
		buttonsPanel.add(stopBotBtn);
		buttonsPanel.add(exitBtn);
	}

	public String[] getArgs() {
		return this.args;
	}

}
