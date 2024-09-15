---
sidebar_position: 10
---
# Platforms
Imperat is a generic command dispatching framework, It can work almost on every platform possible if implemented properly.
so to depend on any of the platforms you must first declare our repoistory in your build tool configuration file as follows:
<Tabs>
    <TabItem value="maven" label="Maven pom.xml" default>
       MAVEN REPO
    </TabItem>

    <TabItem value="gradle" label="Gradle build.gradle">
        GRADLE REPO
    </TabItem>
</Tabs>

In order to add the dependency of any platform, you should first add the dependency of the core module, then add the 
platform's dependency as below:
<Tabs>
    <TabItem value="maven" label="Maven" default> 
        MAVEN DEPENDENCIES
    </TabItem>

    <TabItem value="gradle" label="Gradle">
        GRADLE DEPENDENCIES
    </TabItem>
</Tabs>

Platforms are classified into:
- **Minecraft Platforms**
- **Non-Minecraft Platforms**

## Minecraft platforms
Imperat currently has implementations for the current minecraft-related platforms:
- Bukkit/Spigot/Paper
- Bungeecord

### Bukkit
The `BukkitImperat` is the impl for Imperat on bukkit platform.
The command source in bukkit is called `BukkitSource`.

All resolvers have a middle interface that starts the prefix `Bukkit`,
for example: `BukkitValueResolver`, `BukkitContextResolver`, `BukkitSuggestionResolver`
You are free to make use of them.

### Bungee
SAME AS BUKKIT but the prefix is `Bungee`

## Other platforms
Coming soon...

