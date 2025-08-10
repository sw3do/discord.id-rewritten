<template>
  <div class="min-h-screen bg-[#313338]">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Discord.ID
        </h1>
        <p class="text-[#b5bac1] text-base sm:text-lg">
          View Discord user information
        </p>
        <div v-if="securityStatus.isBlocked" class="mt-4 p-4 bg-red-600 rounded-lg">
          <p class="text-white text-sm">
            🛡️ Your IP has been temporarily blocked due to suspicious activity.
            Please wait {{ Math.ceil(securityStatus.blockTimeRemaining / 60000) }} minutes.
          </p>
        </div>
      </div>

      <div class="max-w-md mx-auto mb-8 px-4 sm:px-0">
        <div class="bg-[#2b2d31] rounded-lg p-4 sm:p-6">
          <div class="mb-4">
            <label class="block text-[#f2f3f5] text-sm font-medium mb-2">
              Discord User ID
            </label>
            <input v-model="userId" type="text" placeholder="Example: 123456789012345678"
              class="w-full px-3 py-2 bg-[#1e1f22] border border-[#3f4147] rounded text-[#f2f3f5] placeholder-[#87898c] focus:outline-none focus:border-[#5865f2] transition-colors text-sm sm:text-base"
              @keyup.enter="searchUser">
          </div>
          <button :disabled="loading || !userId.trim() || securityStatus.isBlocked"
            class="w-full bg-[#5865f2] hover:bg-[#4752c4] disabled:bg-[#4f545c] text-white font-medium py-2 px-4 rounded transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
            @click="searchUser">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </span>
            <span v-else-if="securityStatus.isBlocked">Blocked</span>
            <span v-else>Search User</span>
          </button>

          <div v-if="securityStatus.requestCount > 5"
            class="mt-3 p-3 bg-yellow-600 rounded text-white text-sm text-center">
            ⚠️ You have made {{ securityStatus.requestCount }} requests recently.
            <span v-if="securityStatus.requestCount > 8">Captcha verification may be required soon.</span>
          </div>
        </div>
      </div>

      <div v-if="error" class="max-w-md mx-auto mb-8 px-4 sm:px-0">
        <div class="bg-[#f23f42] rounded p-4">
          <p class="text-white text-center text-sm sm:text-base">
            {{ error }}
          </p>
        </div>
      </div>

      <!-- Enhanced hCaptcha Modal -->
      <div v-if="showCaptcha" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-[#2b2d31] rounded-lg p-4 sm:p-6 max-w-lg w-full mx-4 border border-[#3f4147]">
          <div class="text-center mb-6">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-[#5865f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-[#f2f3f5] text-base sm:text-lg font-semibold mb-2">
              Security Verification Required
            </h3>
            <p class="text-[#b5bac1] text-xs sm:text-sm mb-4">
              Please complete the captcha verification to continue
            </p>
            <div v-if="captchaError" class="mb-4 p-3 bg-red-600 rounded text-white text-sm">
              {{ captchaError }}
            </div>
          </div>

          <div class="flex justify-center mb-6">
            <div id="hcaptcha-container" ref="hcaptchaContainer"></div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button :disabled="captchaLoading"
              class="flex-1 bg-[#4f545c] hover:bg-[#5d6269] disabled:bg-[#3f4147] text-white font-medium py-2 px-4 rounded transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
              @click="closeCaptchaModal">
              Cancel
            </button>
            <button :disabled="captchaLoading || !captchaToken"
              class="flex-1 bg-[#5865f2] hover:bg-[#4752c4] disabled:bg-[#4f545c] text-white font-medium py-2 px-4 rounded transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
              @click="submitCaptcha">
              <span v-if="captchaLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
              <span v-else>Verify & Continue</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="user" class="max-w-md mx-auto px-4 sm:px-0">
        <!-- Discord Profile Card -->
        <div class="rounded-lg overflow-hidden" :style="getCardBackgroundStyle(user)">
          <!-- Banner -->
          <div class="relative h-20 sm:h-24">
            <div v-if="user.banner" class="w-full h-full bg-cover bg-center" :style="{
              backgroundImage: `url(${getBannerUrl(user.id, user.banner)})`,
            }" />
            <div v-else-if="user.banner_color" class="w-full h-full" :style="{ backgroundColor: user.banner_color }" />
            <div v-else class="w-full h-full bg-[#5865f2]" />
          </div>

          <!-- Profile Content -->
          <div class="px-3 sm:px-4 pb-4">
            <!-- Avatar -->
            <div class="relative -mt-6 sm:-mt-8 mb-3">
              <div class="relative inline-block">
                <NuxtImg :src="getAvatarUrl(user.id, user.avatar)" :alt="user.username"
                  class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 bg-[#36393f]"
                  :style="getAvatarBorderStyle(user)" />
                <!-- Avatar Decoration -->
                <div v-if="user.avatar_decoration_data" class="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16">
                  <NuxtImg :src="getAvatarDecorationUrl(user.avatar_decoration_data.asset)
                    " :alt="'Avatar decoration'" class="w-full h-full" />
                </div>
                <!-- Online Status -->
                <div v-if="user.lanyard"
                  class="absolute bottom-0 right-0 w-3 h-3 sm:w-5 sm:h-5 border-2 border-[#2b2d31] rounded-full" :style="{
                    backgroundColor: getStatusColor(
                      user.lanyard.discord_status,
                    ),
                  }" :title="getStatusText(user.lanyard.discord_status)" />
              </div>
            </div>

            <!-- User Info -->
            <div class="mb-4">
              <h2
                class="text-[#f2f3f5] font-semibold text-base sm:text-lg leading-tight flex flex-wrap items-center gap-2">
                <span class="break-all">{{
                  user.display_name || user.global_name || user.username
                  }}</span>
                <span v-if="user.clan && user.clan.tag"
                  class="inline-flex items-center gap-1 bg-[#5865f2] text-white text-xs px-2 py-1 rounded font-medium">
                  <NuxtImg v-if="user.clan.badge" :src="getClanBadgeUrl(
                    user.clan.identity_guild_id,
                    user.clan.badge,
                  )
                    " :alt="user.clan.tag" class="w-3 h-3" />
                  {{ user.clan.tag }}
                </span>
              </h2>
              <p class="text-[#b5bac1] text-xs sm:text-sm break-all flex items-center gap-2 flex-wrap">
                <span>
                  {{ user.username }}
                  <span v-if="user.discriminator && user.discriminator !== '0'">#{{ user.discriminator }}</span>
                </span>
                <span v-if="user.bot"
                  class="inline-flex items-center bg-[#5865f2] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  BOT
                </span>
              </p>
            </div>

            <!-- Badges -->
            <div v-if="getUserBadges(user.public_flags, user.bot).length > 0" class="mb-4">
              <div class="flex flex-wrap gap-1 sm:gap-2">
                <NuxtImg v-for="badge in getUserBadges(user.public_flags, user.bot)" :key="badge.name" :src="badge.icon"
                  :alt="badge.name" :title="badge.name" class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <!-- Bio -->
            <div v-if="user.bio" class="mb-4">
              <div class="rounded p-2 sm:p-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-1">
                  ABOUT
                </div>
                <div class="text-[#b5bac1] text-xs sm:text-sm break-words">
                  {{ user.bio }}
                </div>
              </div>
            </div>

            <!-- Status & Activities -->
            <div v-if="user.lanyard" class="mb-4">
              <!-- Discord Status -->
              <div class="rounded p-2 sm:p-3 mb-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-2">
                  STATUS
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full shrink-0" :style="{
                    backgroundColor: getStatusColor(
                      user.lanyard.discord_status,
                    ),
                  }" />
                  <span class="text-[#b5bac1] text-xs sm:text-sm">{{
                    getStatusText(user.lanyard.discord_status)
                    }}</span>
                </div>
                <div v-if="
                  user.lanyard.active_on_discord_desktop
                  || user.lanyard.active_on_discord_web
                  || user.lanyard.active_on_discord_mobile
                " class="mt-2">
                  <div class="text-[#b5bac1] text-xs">
                    Active on:
                  </div>
                  <div class="flex gap-2 mt-1">
                    <span v-if="user.lanyard.active_on_discord_desktop"
                      class="text-[#f2f3f5] text-xs bg-[#5865f2] px-2 py-1 rounded">Desktop</span>
                    <span v-if="user.lanyard.active_on_discord_web"
                      class="text-[#f2f3f5] text-xs bg-[#5865f2] px-2 py-1 rounded">Web</span>
                    <span v-if="user.lanyard.active_on_discord_mobile"
                      class="text-[#f2f3f5] text-xs bg-[#5865f2] px-2 py-1 rounded">Mobile</span>
                  </div>
                </div>
              </div>

              <!-- Spotify -->
              <div v-if="user.lanyard.listening_to_spotify && user.lanyard.spotify" class="rounded p-2 sm:p-3 mb-3"
                :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#1db954]" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  LISTENING TO SPOTIFY
                </div>
                <div class="flex items-center gap-3">
                  <NuxtImg v-if="user.lanyard.spotify.album_art_url" :src="user.lanyard.spotify.album_art_url"
                    :alt="user.lanyard.spotify.album" class="w-12 h-12 sm:w-16 sm:h-16 rounded shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="text-[#f2f3f5] text-xs sm:text-sm font-medium break-words">
                      {{ user.lanyard.spotify.song }}
                    </div>
                    <div class="text-[#b5bac1] text-xs break-words">
                      by {{ user.lanyard.spotify.artist }}
                    </div>
                    <div class="text-[#b5bac1] text-xs break-words">
                      on {{ user.lanyard.spotify.album }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Status -->
              <div v-if="
                user.lanyard.activities
                && user.lanyard.activities.filter(
                  (activity) => activity.type === 4,
                ).length > 0
              " class="rounded p-2 sm:p-3 mb-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-2">
                  CUSTOM STATUS
                </div>
                <div class="space-y-2">
                  <div v-for="activity in user.lanyard.activities.filter(
                    (activity) => activity.type === 4,
                  )" :key="activity.id || activity.name" class="flex items-center gap-2">
                    <div v-if="activity.emoji" class="shrink-0">
                      <NuxtImg v-if="activity.emoji.id"
                        :src="`https://cdn.discordapp.com/emojis/${activity.emoji.id}.${activity.emoji.animated ? 'gif' : 'png'}?size=32`"
                        :alt="activity.emoji.name" class="w-4 h-4" />
                      <span v-else class="text-sm">
                        {{ activity.emoji.name }}
                      </span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div v-if="activity.state" class="text-[#b5bac1] text-xs sm:text-sm break-words">
                        {{ activity.state }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activities -->
              <div v-if="
                user.lanyard.activities
                && user.lanyard.activities.filter(
                  (activity) => activity.name !== 'Spotify' && activity.type !== 4,
                ).length > 0
              " class="rounded p-2 sm:p-3 mb-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-2">
                  ACTIVITIES
                </div>
                <div class="space-y-3">
                  <div v-for="activity in user.lanyard.activities.filter(
                    (activity) => activity.name !== 'Spotify' && activity.type !== 4,
                  )" :key="activity.id || activity.name" class="flex items-start gap-3">
                    <NuxtImg v-if="activity.assets && activity.assets.large_image" :src="activity.assets.large_image.startsWith('mp:')
                      ? `https://media.discordapp.net/${activity.assets.large_image.slice(3)}`
                      : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                      " :alt="activity.name" class="w-10 h-10 sm:w-12 sm:h-12 rounded shrink-0" />
                    <div class="min-w-0 flex-1">
                      <div class="text-[#f2f3f5] text-xs sm:text-sm font-medium break-words">
                        {{ getActivityTypeText(activity.type) }}
                        {{ activity.name }}
                      </div>
                      <div v-if="activity.details" class="text-[#b5bac1] text-xs break-words">
                        {{ activity.details }}
                      </div>
                      <div v-if="activity.state" class="text-[#b5bac1] text-xs break-words">
                        {{ activity.state }}
                      </div>
                      <div v-if="
                        activity.timestamps
                        && formatActivityTime(activity.timestamps)
                      " class="text-[#b5bac1] text-xs">
                        {{ formatActivityTime(activity.timestamps) }} elapsed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Primary Guild -->
            <div v-if="
              user.primary_guild
              && user.primary_guild.identity_guild_id
              !== user.clan?.identity_guild_id
            " class="mb-4">
              <div class="rounded p-2 sm:p-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-1">
                  PRIMARY GUILD
                </div>
                <div class="flex items-center gap-2">
                  <NuxtImg v-if="user.primary_guild.badge" :src="getClanBadgeUrl(
                    user.primary_guild.identity_guild_id,
                    user.primary_guild.badge,
                  )
                    " :alt="user.primary_guild.tag" class="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="text-[#f2f3f5] text-xs sm:text-sm font-medium break-all">
                      {{ user.primary_guild.tag }}
                    </div>
                    <div class="text-[#b5bac1] text-xs break-all">
                      Guild ID: {{ user.primary_guild.identity_guild_id }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Display Name Styles -->
            <div v-if="user.display_name_styles" class="mb-4">
              <div class="rounded p-2 sm:p-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-1">
                  DISPLAY NAME STYLES
                </div>
                <div class="text-[#b5bac1] text-xs break-all">
                  {{ JSON.stringify(user.display_name_styles) }}
                </div>
              </div>
            </div>

            <!-- User Details -->
            <div class="space-y-3">
              <div class="rounded p-2 sm:p-3" :style="getSectionBackgroundStyle(user)">
                <div class="text-[#f2f3f5] text-xs font-medium mb-2">
                  USER INFORMATION
                </div>
                <div class="space-y-1 text-xs">
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">ID:</span>
                    <span class="text-[#f2f3f5] font-mono break-all text-right">{{ user.id }}</span>
                  </div>
                  <div v-if="user.accent_color" class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">Accent Color:</span>
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-3 h-3 rounded-full border border-[#3f4147] shrink-0" :style="{
                        backgroundColor: `#${user.accent_color.toString(16).padStart(6, '0')}`,
                      }" />
                      <span class="text-[#f2f3f5] font-mono text-right break-all">#{{
                        user.accent_color
                          .toString(16)
                          .padStart(6, "0")
                          .toUpperCase()
                      }}</span>
                    </div>
                  </div>
                  <div v-if="user.banner_color" class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">Banner Color:</span>
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-3 h-3 rounded-full border border-[#3f4147] shrink-0"
                        :style="{ backgroundColor: user.banner_color }" />
                      <span class="text-[#f2f3f5] font-mono text-right break-all">{{ user.banner_color.toUpperCase()
                        }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">Public Flags:</span>
                    <span class="text-[#f2f3f5] font-mono text-right break-all">{{ user.public_flags }}</span>
                  </div>
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">Flags:</span>
                    <span class="text-[#f2f3f5] font-mono text-right break-all">{{ user.flags }}</span>
                  </div>
                  <div class="flex justify-between items-start gap-2">
                    <span class="text-[#b5bac1] shrink-0">Account Created:</span>
                    <span class="text-[#f2f3f5] text-xs text-right break-all">{{
                      formatDate(getAccountCreationDate(user.id))
                      }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nameplate -->
            <div v-if="user.collectibles && user.collectibles.nameplate" class="mt-4">
              <div class="relative rounded-lg overflow-hidden min-h-[60px] sm:min-h-[80px]">
                <video :src="getNameplateUrl(user.collectibles.nameplate.asset)" autoplay loop muted
                  class="absolute inset-0 w-full h-full object-cover z-0" />
                <div class="relative p-2 sm:p-4 z-10">
                  <div class="flex items-center gap-2 sm:gap-3">
                    <div class="relative shrink-0">
                      <NuxtImg :src="getAvatarUrl(user.id, user.avatar)" :alt="user.username"
                        class="w-8 h-8 sm:w-12 sm:h-12 rounded-full" />
                      <div v-if="user.avatar_decoration_data" class="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12">
                        <NuxtImg :src="getAvatarDecorationUrl(
                          user.avatar_decoration_data.asset,
                        )
                          " :alt="'Avatar decoration'" class="w-full h-full" />
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div
                        class="text-white font-medium text-xs sm:text-sm flex flex-wrap items-center gap-1 sm:gap-2 drop-shadow-lg">
                        <span class="break-all">{{
                          user.display_name || user.global_name || user.username
                          }}</span>
                        <span v-if="user.clan && user.clan.tag"
                          class="inline-flex items-center gap-1 bg-[#5865f2] text-white text-xs px-2 py-0.5 rounded font-medium">
                          <NuxtImg v-if="user.clan.badge" :src="getClanBadgeUrl(
                            user.clan.identity_guild_id,
                            user.clan.badge,
                          )
                            " :alt="user.clan.tag" class="w-3 h-3" />
                          {{ user.clan.tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="mt-8 py-6 text-center border-t border-[#3f4147] bg-[#1e1f22]">
    <div class="text-[#b5bac1] text-sm px-4">
      <p class="mb-2">
        <a href="https://github.com/sw3do/discord.id-rewritten" target="_blank" rel="noopener noreferrer"
          class="text-[#5865f2] hover:text-[#4752c4] transition-colors font-medium">Open source</a>
        • Rebuilt by
        <a href="https://github.com/sw3do" target="_blank" rel="noopener noreferrer"
          class="text-[#5865f2] hover:text-[#4752c4] transition-colors font-medium">sw3do</a>
      </p>
      <p class="text-xs text-[#80848e]">
        Made with ❤️ using Nuxt.js & Tailwind CSS
      </p>
    </div>
  </footer>
</template>

<script setup>


const userId = ref('')
const user = ref(null)
const loading = ref(false)
const error = ref('')
const showCaptcha = ref(false)
const captchaLoading = ref(false)
const captchaToken = ref('')
const captchaError = ref('')
const hcaptchaContainer = ref(null)
const hcaptchaWidgetId = ref(null)

const config = useRuntimeConfig()
const hcaptchaSiteKey = config.public.hcaptchaSiteKey

const securityStatus = ref({
  isBlocked: false,
  blockTimeRemaining: 0,
  requestCount: 0,
  lastRequestTime: 0
})

const updateSecurityStatus = () => {
  const now = Date.now()
  const requests = JSON.parse(localStorage.getItem('requestHistory') || '[]')
  const recentRequests = requests.filter(time => now - time < 300000)

  securityStatus.value.requestCount = recentRequests.length
  securityStatus.value.lastRequestTime = recentRequests[recentRequests.length - 1] || 0

  const blockUntil = localStorage.getItem('blockedUntil')
  if (blockUntil && now < parseInt(blockUntil)) {
    securityStatus.value.isBlocked = true
    securityStatus.value.blockTimeRemaining = parseInt(blockUntil) - now
  } else {
    securityStatus.value.isBlocked = false
    securityStatus.value.blockTimeRemaining = 0
    localStorage.removeItem('blockedUntil')
  }
}

const addRequestToHistory = () => {
  const now = Date.now()
  const requests = JSON.parse(localStorage.getItem('requestHistory') || '[]')
  requests.push(now)

  const recentRequests = requests.filter(time => now - time < 300000)
  localStorage.setItem('requestHistory', JSON.stringify(recentRequests))

  updateSecurityStatus()
}

const onCaptchaVerify = (token) => {
  captchaToken.value = token
  captchaError.value = ''
}

const onCaptchaError = (error) => {
  captchaError.value = 'Captcha verification failed. Please try again.'
  captchaToken.value = ''
}

const onCaptchaExpired = () => {
  captchaToken.value = ''
  captchaError.value = 'Captcha expired. Please verify again.'
}

const loadHcaptcha = () => {
  return new Promise((resolve) => {
    if (window.hcaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.hcaptcha.com/1/api.js'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

const renderHcaptcha = async () => {
  console.log('renderHcaptcha called, sitekey:', hcaptchaSiteKey)
  await loadHcaptcha()

  if (hcaptchaWidgetId.value !== null) {
    window.hcaptcha.reset(hcaptchaWidgetId.value)
    return
  }

  console.log('Rendering hcaptcha widget')
  hcaptchaWidgetId.value = window.hcaptcha.render(hcaptchaContainer.value, {
    sitekey: hcaptchaSiteKey,
    theme: 'dark',
    callback: onCaptchaVerify,
    'error-callback': onCaptchaError,
    'expired-callback': onCaptchaExpired
  })
}

const closeCaptchaModal = () => {
  showCaptcha.value = false
  captchaToken.value = ''
  captchaError.value = ''
  if (hcaptchaWidgetId.value !== null && window.hcaptcha) {
    window.hcaptcha.reset(hcaptchaWidgetId.value)
  }
}

const submitCaptcha = async () => {
  if (!captchaToken.value) {
    captchaError.value = 'Please complete the captcha verification.'
    return
  }

  captchaLoading.value = true
  captchaError.value = ''

  try {
    const response = await $fetch('/api/verify-captcha', {
      method: 'POST',
      body: {
        token: captchaToken.value,
        userId: userId.value
      }
    })

    if (response.success) {
      showCaptcha.value = false
      await performSearch()
    } else {
      captchaError.value = 'Captcha verification failed. Please try again.'
    }
  } catch (err) {
    captchaError.value = err.data?.message || 'Captcha verification failed. Please try again.'
  } finally {
    captchaLoading.value = false
  }
}

const searchUser = async () => {
  if (!userId.value.trim()) return
  if (securityStatus.value.isBlocked) return

  if (!/^\d{17,19}$/.test(userId.value)) {
    error.value = 'Please enter a valid Discord user ID (17-19 digits).'
    return
  }

  await performSearch()
}

const performSearch = async () => {
  loading.value = true
  error.value = ''
  user.value = null

  try {
    addRequestToHistory()

    const response = await $fetch(`/api/discord/${userId.value}`)
    user.value = response
  } catch (err) {
    if (err.status === 404 || err.statusCode === 404) {
      error.value = 'User not found. Please enter a valid Discord ID.'
    } else if (err.status === 401 || err.statusCode === 401) {
      error.value = 'Invalid API key. Please check your bot token.'
    } else if (err.status === 429 || err.statusCode === 429) {
      console.log('429 error detected, showing captcha modal')
      showCaptcha.value = true
      error.value = ''
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

watch(showCaptcha, async (newValue) => {
  console.log('showCaptcha changed to:', newValue)
  if (newValue) {
    await nextTick()
    await renderHcaptcha()
  }
})

onMounted(() => {
  updateSecurityStatus()

  setInterval(() => {
    updateSecurityStatus()
  }, 1000)
})

const getAvatarUrl = (userId, avatarHash) => {
  if (!avatarHash) {
    const defaultAvatarIndex = (Number.parseInt(userId) >> 22) % 6
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  }
  const extension = avatarHash.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=256`
}

const getBannerUrl = (userId, bannerHash) => {
  if (!bannerHash) return null
  const extension = bannerHash.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${extension}?size=1024`
}

const getAvatarDecorationUrl = (decorationHash) => {
  return `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png`
}

const getClanBadgeUrl = (clanId, clanHash) => {
  if (!clanId || !clanHash) return null
  return `https://cdn.discordapp.com/clan-badges/${clanId}/${clanHash}.png`
}

const getNameplateUrl = (asset) => {
  if (!asset) return null
  return `https://cdn.discordapp.com/assets/collectibles/${asset}asset.webm`
}

const getUserBadges = (flags, isBot = false) => {
  const badges = []
  const flagMap = {
    1: { name: 'Discord Staff', icon: '/images/discordstaff.svg' },
    2: { name: 'Partnered Server Owner', icon: '/images/discordpartner.svg' },
    4: { name: 'HypeSquad Events', icon: '/images/hypesquadevents.svg' },
    8: {
      name: 'Discord Bug Hunter (Tier 1)',
      icon: '/images/discordbughunter1.svg',
    },
    64: { name: 'HypeSquad Bravery', icon: '/images/hypesquadbravery.svg' },
    128: {
      name: 'HypeSquad Brilliance',
      icon: '/images/hypesquadbrilliance.svg',
    },
    256: { name: 'HypeSquad Balance', icon: '/images/hypesquadbalance.svg' },
    512: { name: 'Early Supporter', icon: '/images/discordearlysupporter.svg' },
    1024: { name: 'Team User', icon: '/images/discordstaff.svg' },
    16384: {
      name: 'Discord Bug Hunter (Tier 2)',
      icon: '/images/discordbughunter2.svg',
    },
    65536: { name: 'Verified Bot', icon: '/images/special/VerifiedBot.svg' },
    131072: {
      name: 'Early Verified Bot Developer',
      icon: '/images/discordbotdev.svg',
    },
    262144: {
      name: 'Moderator Programs Alumni',
      icon: '/images/discordmod.svg',
    },
    524288: { name: 'Bot HTTP Interactions', icon: '/images/supportscommands.svg' },
    4194304: { name: 'Active Developer', icon: '/images/activedeveloper.svg' },
    16777216: { name: 'Uses Automod', icon: '/images/automod.svg' },
  }

  for (const [flag, badge] of Object.entries(flagMap)) {
    if (flags & Number.parseInt(flag)) {
      badges.push(badge)
    }
  }

  if (isBot) {
    const isVerifiedBot = flags & 65536
    if (!isVerifiedBot) {
      badges.unshift({ name: 'Bot', icon: '/images/special/Bot.svg' })
    }
  }

  return badges
}

const getCardBackgroundStyle = (user) => {
  if (!user.accent_color) {
    return {
      background: '#2b2d31',
    }
  }

  const accentColor = `#${user.accent_color.toString(16).padStart(6, '0')}`

  const lighterColor = adjustBrightness(accentColor, 0.3)
  const darkerColor = adjustBrightness(accentColor, -0.4)

  return {
    background: `linear-gradient(135deg, ${darkerColor} 0%, ${accentColor} 50%, ${lighterColor} 100%)`,
    boxShadow: `0 8px 32px ${accentColor}40`,
  }
}

const adjustBrightness = (hex, percent) => {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent * 100)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return `#${(
    0x1000000
    + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000
    + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100
    + (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`
}

const getSectionBackgroundStyle = (user) => {
  if (!user.accent_color) {
    return {
      background: '#1e1f22',
    }
  }

  const accentColor = `#${user.accent_color.toString(16).padStart(6, '0')}`
  const darkerColor = adjustBrightness(accentColor, -0.7)

  return {
    background: `linear-gradient(135deg, ${darkerColor} 0%, ${adjustBrightness(darkerColor, 0.1)} 100%)`,
    border: `1px solid ${accentColor}30`,
  }
}

const getAvatarBorderStyle = (user) => {
  if (!user.accent_color) {
    return {
      borderColor: '#2b2d31',
    }
  }

  const accentColor = `#${user.accent_color.toString(16).padStart(6, '0')}`

  return {
    borderColor: accentColor,
    boxShadow: `0 0 20px ${accentColor}60`,
  }
}

const getAccountCreationDate = (userId) => {
  const discordEpoch = 1420070400000
  const timestamp = (BigInt(userId) >> 22n) + BigInt(discordEpoch)
  return new Date(Number(timestamp))
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusColor = (status) => {
  const statusColors = {
    online: '#23a55a',
    idle: '#f0b232',
    dnd: '#f23f43',
    offline: '#80848e',
  }
  return statusColors[status] || statusColors.offline
}

const getStatusText = (status) => {
  const statusTexts = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
  }
  return statusTexts[status] || 'Unknown'
}

const getActivityTypeText = (type) => {
  const activityTypes = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    4: 'Custom Status',
    5: 'Competing in',
  }
  return activityTypes[type] || 'Unknown'
}

const formatActivityTime = (timestamps) => {
  if (!timestamps) return null

  if (timestamps.start && timestamps.end) {
    const start = new Date(timestamps.start)
    const end = new Date(timestamps.end)
    const diff = end - start
    const totalMinutes = Math.floor(diff / 60000)

    if (totalMinutes < 1) {
      const seconds = Math.floor(diff / 1000)
      return seconds > 0 ? `${seconds}s` : '0s'
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${totalMinutes}m`
  }

  if (timestamps.start) {
    const start = new Date(timestamps.start)
    const now = new Date()
    const diff = now - start
    const totalMinutes = Math.floor(diff / 60000)

    if (totalMinutes < 1) {
      const seconds = Math.floor(diff / 1000)
      return seconds > 0 ? `${seconds}s` : '0s'
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${totalMinutes}m`
  }

  return null
}
</script>

<style>
html,
body {
  background-color: #313338;
  margin: 0;
  padding: 0;
}
</style>
