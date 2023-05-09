## FlatListRTLFix

A repo to reproduce RTL-related issues with React Native's `FlatList` (and other `VirtualizedList`'s).

## Install and run

Run

    yarn
    yarn patch
    yarn start

On one terminal, and

    yarn android # or yarn ios

in another. On Android, we're using `newArchEnabled=true` in `gradle.properties` so that we can build React Native from source (instead of using the precompiled binary), and change its Java files to try and fix the bugs.

## Patching react-native for Android

Edit your files directly inside `node_modules/react-native/ReactAndroid` (and subfolders), re-launching via `yarn android` after your changes. It might take a **long** time, but it's the best we got right now.

Once you're happy with your results, you can copy your files to the `patch` folder to share them. Because unfortunately `patch-package` crashes when dealing with React Native, we have our own poor man's solution. Run

    yarn copyToPath path/to/the/file/to/include

This will automatically recreate all needed intermediate folders so that `yarn patch` will replace the contents of `node_modules/react-native` on other computers.