---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Platforms
Imperat is a generic command dispatching framework, It can work almost on every platform possible if implemented properly.
so to depend on any of the platforms you must first declare our repoistory in your build tool configuration file as follows:
<Tabs>
    <TabItem value="maven" label="Maven pom.xml" default>
       Maven central (default)
    </TabItem>

    <TabItem value="gradle" label="Gradle build.gradle">
        ```
            repositories {
                mavenCentral();
            }
        ```
    </TabItem>
</Tabs>

In order to add the dependency of any platform, you should first add the dependency of the core module, then add the 
platform's dependency as below:
<Tabs>
    <TabItem value="maven" label="Maven" default> 
    
    ```xml 
    <dependency>
        <groupId>dev.velix</groupId>
            <artifactId>imperat-PLATFORM</artifactId>
        <version>{version}</version>
    </dependency>
    ```
    </TabItem>

    <TabItem value="gradle" label="Gradle (short)">
        `implementation "dev.velix:imperat-PLATFORM:{version}"`
    </TabItem>
</Tabs>

:::tip[CAUTION]
Replace `PLATFORM` with your platform's name in lowercase.
:::

Platforms are classified into:
- **Minecraft Platforms**
- **Non-Minecraft Platforms**

## Minecraft platforms
Imperat currently has implementations for the current minecraft-related platforms:
- Bukkit
- Bungeecord
- Velocity

:::tip[PRO TIP]
You can use and integrate Imperat with Mojang's Brigadier 
you can do the following after initializing Imperat and BEFORE registering any commands.
```java
imperat.applyBrigadier();
```

:::

### Bukkit
The `BukkitImperat` is the type of Imperat to use on bukkit platform.
Use `BukkitSource` as the `Source`

:::tip[CAUTION]
You **MUST** NOT register your commands within your `plugin.yml`
:::


### Bungee
SAME AS BUKKIT but the prefix is `Bungee`

### Velocity
SAME AS BUKKIT, but the prefix is `Velocity`

### Minestom
SAME AS BUKKIT, but the prefix is `Minestom`

## Other platforms

### CLI
**CLI** for command-line applications, The `CommandLineImperat` is the impl for Imperat on CLI platform.
the command source in CLI is called `ConsoleSource`.

### Others
coming soon...

