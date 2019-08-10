package frame.models;

import java.awt.Color;
import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowEvent;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.swing.JComponent;
import javax.swing.JFileChooser;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JPopupMenu;
import javax.swing.border.LineBorder;

import frame.managers.BotProcessManager;
import frame.utils.FrameUtilities;

@SuppressWarnings("serial")
public class MenuBar extends JMenuBar {
	JMenu fileMenu, optionMenu;
	JMenuItem chooseBot, envChoose, botProperties;

	public MenuBar() {
		this.setAlignmentY(Component.CENTER_ALIGNMENT);
		this.setBorder(new LineBorder(new Color(0, 0, 0), 0));
		this.setSize(new Dimension(400, 36));
		this.setPreferredSize(new Dimension(400, 36));
		this.setLocation(0, 0);
		this.setFont(new Font("Calibri", Font.PLAIN, 11));
		this.fileMenu = new JMenu("File");
		this.chooseBot = new JMenuItem("Choose bot file");
		this.envChoose = new JMenuItem("Choose environment");
		setUpLoad();
		this.fileMenu.add(this.chooseBot);
		this.optionMenu = new JMenu("Options");
		this.botProperties = new JMenuItem("Bot Properties");
		setupProperties();
		this.optionMenu.add(this.botProperties);
		this.add(fileMenu);
		this.add(optionMenu);
	}

	private void setupProperties() {
		this.botProperties.addActionListener(new ActionListener() {
			// TODO Add window that holds environments
			@Override
			public void actionPerformed(ActionEvent e) {
				showProperties(getMainFrame(e));
			}

			private void showProperties(Frame mainFrame) {
				Frame optionFrame = new Frame(mainFrame.getLocation(), 400, 200);
				optionFrame.centerFrame();
				addComponentsToPane(optionFrame, mainFrame);
				optionFrame.pack();
				optionFrame.setVisible(true);
			}

			private void addComponentsToPane(Frame optionFrame, Frame mainFrame) {
				Container grid = optionFrame.getContentPane();
				grid.setLayout(new GridBagLayout());
				List<Component> lbls = FrameUtilities.getAllComponentByClass(mainFrame, MultiLabel.class);
				@SuppressWarnings("unchecked")
				List<MultiLabel> found = (List<MultiLabel>)(List<?>) lbls.stream().filter((e) -> ((MultiLabel)e).getPurpose() == "commandInfo").collect(Collectors.toList());
				final String botDirPath = found.get(0).getText();
				GridBagConstraints nonFill = new GridBagConstraints();
				nonFill.fill = GridBagConstraints.NONE;
				nonFill.anchor = GridBagConstraints.WEST;
				nonFill.insets = new Insets(0, 0, 20, 15);

				// Setup first level
				nonFill.gridx = 0;
				nonFill.gridy = 0;
				grid.add(new Label("Bot main file", "properties-directory", true), nonFill);
				nonFill.gridx = 1;
				nonFill.anchor = GridBagConstraints.NORTH;
				MultiLabel txtF1 = new MultiLabel(botDirPath);
				Dimension txtFlSize = new Dimension(200, 30);
				txtF1.setPreferredSize(txtFlSize);
				txtF1.setFont(new Font("Calibri", Font.PLAIN, 12));
				txtF1.getTextArea().setEditable(true);
				txtF1.setVisible(true);
				grid.add(txtF1, nonFill);

				// Setup second level
				nonFill.anchor = GridBagConstraints.WEST;
				nonFill.gridx = 0;
				nonFill.gridy = 1;
				grid.add(new Label("Environment", "properties-environment", true), nonFill);
				nonFill.gridx = 1;
				nonFill.anchor = GridBagConstraints.NORTH;
				MultiLabel txtF2 = new MultiLabel();
				txtF2.setText(FrameUtilities.getEnvironment(botDirPath));
				txtF2.setVisible(true);
				txtF2.setPreferredSize(txtFlSize);
				txtF2.setMinimumSize(txtFlSize);
				txtF2.setFont(new Font("Calibri", Font.PLAIN, 12));
				txtF2.getTextArea().setEditable(true);
				grid.add(txtF2, nonFill);

				// Setup third level
				nonFill.anchor = GridBagConstraints.WEST;
				nonFill.gridx = 0;
				nonFill.gridy = 2;
				grid.add(new Label("Active", "properties-activity", true), nonFill);
				nonFill.gridx = 1;
				nonFill.anchor = GridBagConstraints.NORTH;
				MultiLabel txtF3 = new MultiLabel();
				txtF3.setVisible(true);
				txtF3.setPreferredSize(txtFlSize);
				txtF3.setMinimumSize(txtFlSize);
				txtF3.setFont(new Font("Calibri", Font.PLAIN, 12));
				BotProcess bp = BotProcessManager.getInstance().getProcessByPath(botDirPath);
				if (bp != null && bp.getProcess() != null && bp.getProcess().isAlive()) {
					txtF3.setText("Yes");
					grid.add(txtF3, nonFill);
				} else {
					txtF3.setText("No");
					grid.add(txtF3, nonFill);
				}
				Button exitBtn = new Button("Save & Exit");
				exitBtn.addActionListener(new ActionListener() {

					@Override
					public void actionPerformed(ActionEvent e) {
						BotProcess bp = BotProcessManager.getInstance().getProcessByPath(botDirPath);
						if(!txtF1.getText().equalsIgnoreCase(bp.getPath())) {
							bp.setPath(txtF1.getText());
							for (Component lbl : lbls) {
								MultiLabel multi = (MultiLabel) lbl;
								if (multi.getPurpose() == "commandInfo") {
									multi.setText(txtF1.getText());
								}
							}
						}
						if(!txtF2.getText().equalsIgnoreCase(bp.getEnv())) {
							bp.setEnv(txtF2.getText());
							for (Component lbl : lbls) {
								MultiLabel multi = (MultiLabel) lbl;
								if (multi.getPurpose() == "envInfo") {
									multi.setText(txtF2.getText());
								}
							}
						}
						optionFrame.dispatchEvent(new WindowEvent(optionFrame, WindowEvent.WINDOW_CLOSING));
					}
					
				});
				nonFill.anchor = GridBagConstraints.PAGE_END; //bottom of space
				nonFill.insets = new Insets(10,0,0,0);  //top padding
				nonFill.gridx = 2;       //aligned with button 2
				grid.add(exitBtn, nonFill);
			}

		});

	}

	public Map<JMenu, JMenuItem> getAssociatedMenu() {
		Map<JMenu, JMenuItem> items = new LinkedHashMap<>();
		for (int i = 0; i < this.getComponents().length; i++) {
			JMenu menu = (JMenu) this.getComponent(i);
			for (int j = 0; j < menu.getComponents().length; j++) {
				JMenuItem item = (JMenuItem) menu.getComponent(j);
				items.put(menu, item);
			}
		}
		return items;
	}

	private Frame getMainFrame(ActionEvent e) {
		if (e.getSource() instanceof JMenuItem) {
			return (Frame) ((JComponent) ((JPopupMenu) ((JMenuItem) e.getSource()).getParent()).getInvoker())
					.getTopLevelAncestor();
		}
		return null;
	}

	private void setUpLoad() {

		this.chooseBot.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				JFileChooser fileChooser = new JFileChooser();
				int option = fileChooser.showDialog(null, null);
				if (option == JFileChooser.APPROVE_OPTION) {
					// Get top level frame
					List<Component> comps = FrameUtilities.getAllComponentByClass(getMainFrame(e), MultiLabel.class);
					for (Component comp : comps) {
						MultiLabel lblCommand = (MultiLabel) comp;
						if (lblCommand.getPurpose() == "commandInfo") {
							String old = lblCommand.getText();
							lblCommand.setText(fileChooser.getSelectedFile().getAbsolutePath());
							BotProcess bp = BotProcessManager.getInstance().getProcessByPath(old);
							if (bp != null) {
								bp.setPath(fileChooser.getSelectedFile().getAbsolutePath());
							}
							lblCommand.setVisible(true);
						}
					}
				}
			}});
		
		this.envChoose.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				
			}});

	}
}
