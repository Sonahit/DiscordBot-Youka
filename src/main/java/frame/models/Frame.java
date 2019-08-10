package frame.models;

import java.awt.Point;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.Toolkit;
import javax.swing.ImageIcon;
import javax.swing.JFrame;

@SuppressWarnings("serial")
public class Frame extends JFrame {

	public Frame(int x, int y, int width, int height, boolean visible, ImageIcon icon, String title) {
		this.setPreferredSize(new Dimension(width, height));
		this.setSize(width, height);
		this.setLocation(x, y);
		this.setVisible(visible);
		if (icon != null) {
			this.setIcon(icon);
		}
		if (title != null) {
			this.setTitle(title);
		}
	}

	public Frame(int x, int y) {
		this(x, y, 400, 200, false, null, null);
	}

	public Frame(int x, int y, int width, int height) {
		this(x, y, width, height, false, null, null);
	}

	public Frame(int x, int y, int width, int height, boolean visible) {
		this(x, y, width, height, visible, null, null);
	}

	public Frame(int x, int y, int width, int height, boolean visible, ImageIcon icon) {
		this(x, y, width, height, visible, icon, null);
	}

	public Frame(int x, int y, int width, int height, boolean visible, String title) {
		this(x, y, width, height, visible, null, title);
	}

	public Frame(Point point) {
		this((int) point.getX(), (int) point.getY(), 400, 200, false, null, null);
	}

	public Frame(Point point, int width, int height) {
		this((int) point.getX(), (int) point.getY(), width, height, false, null, null);
	}

	public Frame(Point point, int width, int height, boolean visible) {
		this((int) point.getX(), (int) point.getY(), width, height, visible, null, null);
	}

	public Frame(Point point, int width, int height, boolean visible, ImageIcon icon) {
		this((int) point.getX(), (int) point.getY(), width, height, visible, icon, null);
	}

	public Frame(Point point, int width, int height, boolean visible, String title) {
		this((int) point.getX(), (int) point.getY(), width, height, visible, null, title);
	}

	public Frame(Point point, int width, int height, boolean visible, ImageIcon icon, String title) {
		this((int) point.getX(), (int) point.getY(), width, height, visible, icon, title);
	}

	public Frame(Rectangle r) {
		this((int) r.getX(), (int) r.getY(), (int) r.getWidth(), (int) r.getHeight(), false, null, null);
	}

	public Frame(Rectangle r, boolean visible) {
		this((int) r.getX(), (int) r.getY(), (int) r.getWidth(), (int) r.getHeight(), visible, null, null);
	}

	public Frame(Rectangle r, boolean visible, ImageIcon icon) {
		this((int) r.getX(), (int) r.getY(), (int) r.getWidth(), (int) r.getHeight(), visible, icon, null);
	}

	public Frame(Rectangle r, boolean visible, String title) {
		this((int) r.getX(), (int) r.getY(), (int) r.getWidth(), (int) r.getHeight(), visible, null, title);
	}

	public Frame(Rectangle r, boolean visible, ImageIcon icon, String title) {
		this((int) r.getX(), (int) r.getY(), (int) r.getWidth(), (int) r.getHeight(), visible, icon, title);
	}

	public void centerFrame() {
		Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
		int x = screen.width / 2 - this.getWidth() / 2;
		int y = screen.height / 2 - this.getHeight() / 2;
		this.setLocation(x, y);
	}

	public void setIcon(ImageIcon icon) {
		this.setIconImage(icon.getImage());
	}

	public void setIconWithPath(String path) {
		ImageIcon icon = new ImageIcon(path);
		this.setIconImage(icon.getImage());
	}

	public JFrame getFrame() {
		return this;
	}

}
