package frame.models;

import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.swing.JButton;
import javax.swing.JScrollPane;
import javax.swing.JTextPane;
import javax.swing.JViewport;
import javax.swing.text.Document;

import frame.managers.BotProcessManager;

@SuppressWarnings("serial")
public class Button extends JButton {
	private ActionListener actionList;

	public Button() {
	}

	public Button(String text) {
		this(0, 0, text);
	}

	public Button(int width, int height) {
		this(width, height, "");
	}

	public Button(int width, int height, String text) {
		this.setSize(width, height);
		this.setText(text);
	}

	public void deleteAction() {
		this.removeActionListener(actionList);
	}

	private void appendText(JScrollPane panel, String info) {
		if (panel != null) {
			Component[] components = panel.getComponents();
			JViewport viewport = (JViewport) components[0];
			JTextPane textPane = (JTextPane) viewport.getComponentAt(0, 0);
			Document doc = textPane.getDocument();
			try {
				doc.insertString(doc.getLength(), info + "\n", null);
				panel.getVerticalScrollBar().setValue(panel.getVerticalScrollBar().getMaximum());
			} catch (Exception e) {
				System.err.println(e);
			}
		}
	}

	public void setActionOnClick(String action, BotProcess p, JScrollPane panel) {
		switch (action) {
		case ("Exit"): {
			this.addActionListener(actionList = new ActionListener() {
				@Override
				public void actionPerformed(ActionEvent e) {
					System.out.println("Performed\t" + action);
					appendText(panel, "Performed\t" + action);
					if (p.getProcess() != null) {
						p.getProcess().destroy();
						p.setProcess(null);
					}
					System.exit(0);
				}
			});
			break;
		}
		case ("StartBot"): {
			this.addActionListener(actionList = new ActionListener() {
				@Override
				public void actionPerformed(ActionEvent e) {
					try {
						if (p.getProcess() == null) {
							System.out.println("Performed\t" + action);
							appendText(panel, "Performed\t" + action);
							BotProcess pExist = BotProcessManager.getInstance().getProcessByProcess(p);
							if (p.getPath() != pExist.getPath()) {
								p.setPath(pExist.getPath());
							}
							if (p.getEnv() != pExist.getEnv()) {
								p.setEnv(pExist.getEnv());
							}
							p.setProcess(Runtime.getRuntime().exec(p.getCommand()));
							Thread getInfoThread = new Thread() {
								@Override
								public void run() {
									while (p.getProcess() != null) {
										BufferedReader in = new BufferedReader(
												new InputStreamReader(p.getProcess().getInputStream()));
										try {
											String info = String.format("%s", in.readLine());
											if (info.equals("null")) {
												in = null;
												break;
											}
											appendText(panel, info);
											System.out.println(info);
											Thread.sleep(1);
										} catch (IOException | InterruptedException e) {
											// TODO Auto-generated catch block
											e.printStackTrace();
										}
									}
								}
							};
							getInfoThread.start();
						} else {
							appendText(panel, "Bot already has been started");
							System.out.println("Bot already has been started");
						}
					} catch (IOException e1) {
						appendText(panel, "Couldn't execute command");
						System.err.println("Couldn't execute command");
						e1.printStackTrace();
					}
				}
			});
			break;
		}
		case ("StopBot"): {
			this.addActionListener(actionList = new ActionListener() {
				@Override
				public void actionPerformed(ActionEvent ev) {
					appendText(panel, "Performed\t" + action);
					System.out.println("Performed\t" + action);
					try {
						p.getProcess().destroy();
						p.setProcess(null);
					} catch (Exception exc) {
						appendText(panel, "Process haven't been started");
						System.out.println("Process haven't been started");
					}
				}
			});
			break;
		}
		}
	}
}
