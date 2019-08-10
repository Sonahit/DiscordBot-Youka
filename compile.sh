compiledDirJava11="./compiled/java11"
compiledDirJava8="./compiled/java8"

function deletePrevious {
	if [ "$(ls -A $DIR)" ]; then
	{
		rm -r $compiledDirJava11/*
		rm -r $compiledDirJava8/*
		echo Deleted 
	}
	fi
}

javaMain="./src/main/java/frame/Main.java"

function createDir {
	mkdir $compiledDirJava11
	mkdir $compiledDirJava8
	echo Created
}


function compileJava11 {
	classPath="./src/main/java"
	JAVA_HOME="C:\Program Files\Java\jdk-11"
	"$JAVA_HOME/bin/javac.exe" -version
	"$JAVA_HOME/bin/javac.exe" -d $compiledDirJava11 -cp $classPath $javaMain
	
}

function compileJava8 {
	JAVA_HOME="C:\Program Files\Java\jdk1.8.0_191"
	classPath="./src/main/java"
	"$JAVA_HOME/bin/javac.exe" -version
	"$JAVA_HOME/bin/javac.exe" -d $compiledDirJava8 -cp $classPath $javaMain
}

function getAssets {
	assetsPath="./src/main/java/frame/assets"
	cp -rf $assetsPath $compiledDirJava8/frame/assets
	cp -rf $assetsPath $compiledDirJava11/frame/assets
}

deletePrevious && createDir && compileJava11 && compileJava8 && getAssets;

